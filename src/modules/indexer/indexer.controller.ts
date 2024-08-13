import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Put,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { IndexerService } from './indexer.service';

@Controller('socket-bridge')
export class IndexerController {
  constructor(private readonly indexerService: IndexerService) {}

  @Get('latest')
  async getLatestEvents(
    @Query('count') count: number,
    @Query('offset') offset: number,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.indexerService.getEvents(
        count ? Number(count) : 10,
        offset ? Number(offset) : 0,
      ),
    };
  }

  @Get('aggregated')
  async getAggregatedAnalytics(
    @Query('sortKey') sortKey: string,
    @Query('sortOrder') sortOrder: number,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.indexerService.getAggregatedPerToken(
        sortKey ?? 'secondsSinceLastTxn',
        sortOrder ? Number(sortOrder) : -1,
      ),
    };
  }
}
