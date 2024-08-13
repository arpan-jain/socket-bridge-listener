import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { IndexerModule } from './modules/indexer/indexer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService): RedisModuleOptions => {
        const url = configService.get('REDIS_URL');
        return {
          type: 'single',
          url,
          options: {
            reconnectOnError: () => true,
            retryStrategy: (times) => Math.min(times * 100, 2000),
          },
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URL'),
      }),
      inject: [ConfigService],
      connectionName: 'indexer-db',
    }),
    IndexerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
