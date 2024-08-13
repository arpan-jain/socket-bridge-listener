export type CHAIN_LOG = {
  eventName: string;
  args: {
    amount: bigint;
    token: `0x${string}`;
    toChainId: bigint;
    bridgeName: `0x${string}`;
    sender: `0x${string}`;
    receiver: `0x${string}`;
    metadata: `0x${string}`;
  };
  address: `0x${string}`;
  topics: [] | [`0x${string}`, ...`0x${string}`[]];
  data: `0x${string}`;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
  transactionIndex: number;
  blockHash: `0x${string}`;
  logIndex: number;
  removed: boolean;
};
