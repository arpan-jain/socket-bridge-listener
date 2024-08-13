import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { schedule } from 'node-cron';
import {
  BridgeEvent,
  BridgeEventDocument,
} from './entities/bridge-event.entity';
import {
  createPublicClient,
  http,
  parseAbi,
  parseAbiItem,
  hexToBytes,
  bytesToString,
  formatEther,
  decodeEventLog,
  formatUnits,
} from 'viem';
import { mainnet } from 'viem/chains';
import { CHAIN_LOG } from './types';
import { socketBridgeContract, socketBridgeEvent, erc20Abi } from './constants';
import { QueueService } from './queue.service';

@Injectable()
export class IndexerService {
  private viemClient;
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly queueService: QueueService,
    @InjectModel(BridgeEvent.name, 'indexer-db')
    private readonly bridgeEventModel: Model<BridgeEventDocument>,
  ) {
    this.viemClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    });
    this.startListening();
    // fetch logs every min.
    /*schedule('*!/10 * * * * *', () => {
      console.log(`fetching logs....`);
      this.getHistoricalLogs(BigInt(20507230), BigInt(20507240));
    });*/
  }

  private async startListening() {
    return this.viemClient.watchContractEvent({
      address: socketBridgeContract.address as `0x${string}`,
      abi: parseAbi([socketBridgeEvent]),
      //abi: socketBridgeContract.abi,
      //eventName: 'SocketBridge',
      pollingInterval: 10_000,
      onLogs: async (logs) => {
        console.log(`logs: `, logs);
        await this.queueService.addJob(
          logs.map((l: CHAIN_LOG) => ({
            _id: l.transactionHash as string,
            transactionHash: l.transactionHash as string,
            eventName: l.eventName,
            token: l.args.token as string,
            amountInWei: l.args.amount.toString() as string,
            chainId: Number(l.args.toChainId),
            bridge: l.args.bridgeName as string,
            sender: l.args.sender as string,
            receiver: l.args.receiver as string,
            metadata: l.args.metadata as string,
            blockNumber: Number(l.blockNumber),
            positionInBlock: Number(l.transactionIndex),
            logIndex: Number(l.logIndex),
            deleted: false,
          })),
        );
        console.log('Job added to queue');
      },
    });
  }

  private async getHistoricalLogs(fromBlock: bigint, toBlock: bigint) {
    const logs = await this.viemClient.getLogs({
      address: socketBridgeContract.address as `0x${string}`,
      event: parseAbiItem(socketBridgeEvent),
      fromBlock,
      toBlock,
    });
    console.log('historical logs: ', logs);
    await this.processEvents(logs);
  }

  /** format and put in db **/
  async processEvents(events) {
    /*try {
      const hexString = events[0].args.bridgeName;
      const byteArray = hexToBytes(hexString);
      const decodedString = bytesToString(byteArray).replace(/\0/g, '');
      console.log('\nbytesToString: ', decodedString);
    } catch (error) {
      console.error('Error decoding bytesToString:', error);
    }*/
    return await Promise.all(
      events.map(async (event) => {
        try {
          return await this.processAndSaveEventInDb(event);
        } catch (err) {
          console.error(
            `Error while process event with hash ${event.transactionHash}`,
            err,
          );
        }
      }),
    );
  }

  private async processAndSaveEventInDb(
    event: Omit<
      BridgeEvent,
      | 'tokenSymbol'
      | 'tokenDecimals'
      | 'amountInEther'
      | 'gas'
      | 'gasPrice'
      | 'maxFeePerGas'
      | 'maxPriorityFeePerGas'
      | 'blockTimestampInSeconds'
      | 'totalGasCostInEther'
    >,
  ) {
    try {
      // check if the txn is already present in db.
      // if not, get txn receipt and data
      // append required gas price details and save in db
      const dbTxn = await this.getEventDataFromDb(event._id);
      //console.log(`dbTxn: `, dbTxn);
      if (dbTxn) return;

      const [
        { symbol, decimals },
        { gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas },
        blockTimestampInSeconds,
      ] = await Promise.all([
        this.getTokenInfo(event.token),
        this.getTxnDetails(event._id),
        this.getBlockTimestamp(BigInt(event.blockNumber)),
      ]);
      //console.log({ gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas });
      //console.log(`blockTimestampInSeconds: `, blockTimestampInSeconds);
      const res = await this.saveEventInDb({
        ...event,
        tokenSymbol: symbol,
        tokenDecimals: decimals,
        amountInEther: Number(formatUnits(BigInt(event.amountInWei), decimals)),
        gas: gas.toString(),
        gasPrice: gasPrice.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        blockTimestampInSeconds,
        totalGasCostInEther: Number(
          formatEther(BigInt(gas) * BigInt(gasPrice)),
        ),
      });
      console.log(`save res: `, res);
    } catch (err) {
      console.error(`Error while saving in db: `, err);
      throw err;
    }
  }

  private async getTxnDetails(txnHash: string) {
    return this.viemClient.getTransaction({
      hash: txnHash,
    });
  }

  private async getBlockTimestamp(blockNumber: bigint) {
    const block = await this.viemClient.getBlock(blockNumber);
    return Number(block.timestamp);
  }

  /**
   * gets the token info from redis cache, if not present in cache, get from rpc
   * @param tokenAddress
   */
  private async getTokenInfo(tokenAddress) {
    try {
      if (!tokenAddress) throw new Error(`Invalid token address!`);
      // return early for native eth token
      if (tokenAddress === `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`)
        return {
          symbol: 'ETH',
          decimals: 18,
        };
      const key = `tokenInfo:${tokenAddress}`;
      let cachedInfo: string = await this.redis.get(key);
      if (!cachedInfo) {
        const [symbol, decimals] = await Promise.all([
          this.viemClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'symbol',
          }),
          this.viemClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'decimals',
          }),
        ]);
        // cache in redis
        cachedInfo = JSON.stringify({ symbol, decimals });
        await this.redis.set(key, cachedInfo);
      }
      return JSON.parse(cachedInfo);
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw error;
    }
  }

  private async getEventDataFromDb(txnHash: string) {
    return this.bridgeEventModel.findById(txnHash).lean();
  }

  private async saveEventInDb(bridgeEvent: BridgeEvent) {
    return this.bridgeEventModel.create(bridgeEvent);
  }

  async getEvents(count: number, offset: number) {
    return this.bridgeEventModel
      .find({
        deleted: false,
      })
      .sort({
        blockNumber: -1,
        positionInBlock: -1,
      })
      .skip(offset)
      .limit(count)
      .lean();
  }

  async getAggregatedPerToken(sortKey: string, sortOrder: number) {
    const validSortKeys = [
      'secondsSinceLastTxn',
      'count',
      'totalAmountBridged',
      'totalGasCost',
    ];
    if (validSortKeys.indexOf(sortKey) === -1)
      throw new Error('Invalid Sort Key');
    const data = await this.bridgeEventModel.aggregate([
      {
        $match: {
          deleted: false,
        },
      },
      {
        $group: {
          _id: {
            chainId: '$chainId',
            tokenSymbol: '$tokenSymbol',
          },
          count: { $sum: 1 },
          totalGasCost: { $sum: '$totalGasCostInEther' },
          latestBlock: { $max: '$blockNumber' },
          totalAmountBridged: { $sum: '$amountInEther' },
          maxAmountBridged: { $max: '$amountInEther' },
          latestTimestamp: { $max: '$blockTimestampInSeconds' },
        },
      },
      {
        $project: {
          _id: 0,
          chainId: '$_id.chainId',
          tokenSymbol: '$_id.tokenSymbol',
          count: 1,
          totalGasCost: 1,
          latestBlock: 1,
          totalAmountBridged: 1,
          maxAmountBridged: 1,
          latestTimestamp: 1,
        },
      },
    ]);
    return data
      .map((e) => ({
        ...e,
        secondsSinceLastTxn: Date.now() / 1000 - e.latestTimestamp,
      }))
      .sort((a, b) => (sortOrder >= 0 ? 1 : -1) * (a[sortKey] - b[sortKey]));
  }
}
