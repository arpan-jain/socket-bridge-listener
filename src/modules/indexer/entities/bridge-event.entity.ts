import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BridgeEventDocument = BridgeEvent & Document;

@Schema({ timestamps: true })
export class BridgeEvent {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  transactionHash: string;

  @Prop({ required: true })
  eventName: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  tokenSymbol: string;

  @Prop({ required: true })
  tokenDecimals: number;

  @Prop({ required: true })
  amountInWei: string;

  @Prop({ required: true })
  amountInEther: number;

  @Prop({ required: true })
  chainId: number;

  @Prop({ required: true })
  bridge: string;

  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  receiver: string;

  @Prop({ required: true })
  metadata: string;

  @Prop({ required: true })
  blockNumber: number;

  @Prop({ required: true })
  positionInBlock: number;

  @Prop({ required: true })
  logIndex: number;

  @Prop({ required: true })
  gas: string;

  @Prop({ required: true })
  gasPrice: string;

  @Prop({ required: true })
  maxFeePerGas: string;

  @Prop({ required: true })
  maxPriorityFeePerGas: string;

  @Prop({ required: true })
  totalGasCostInEther: number;

  @Prop({ required: true })
  blockTimestampInSeconds: number;

  @Prop({ required: true, type: Boolean, default: false })
  deleted: boolean;
}

export const BridgeEventSchema = SchemaFactory.createForClass(BridgeEvent);

// not adding unique index on txn hash, as it will be used for primary identifier _id
BridgeEventSchema.index({ tokenSymbol: 1 });
BridgeEventSchema.index({ chainId: 1, tokenSymbol: 1 });
BridgeEventSchema.index({ blockTimestampInSeconds: 1 });
BridgeEventSchema.index({ blockNumber: -1, positionInBlock: -1 });
