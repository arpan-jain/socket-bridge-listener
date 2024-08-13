import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IndexerService } from './indexer.service';
import { IndexerController } from './indexer.controller';
import { BridgeEvent, BridgeEventSchema } from './entities/bridge-event.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';
import { QueueProcessor } from './queue.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: configService.get<string>('REDIS_URL'),
      }),
    }),
    BullModule.registerQueue({
      name: 'bridge-event-queue',
    }),
    MongooseModule.forFeature(
      [{ name: BridgeEvent.name, schema: BridgeEventSchema }],
      'indexer-db',
    ),
  ],
  controllers: [IndexerController],
  providers: [IndexerService, QueueService, QueueProcessor],
  exports: [IndexerService],
})
export class IndexerModule {}
