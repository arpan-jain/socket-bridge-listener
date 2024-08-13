import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { IndexerService } from './indexer.service';

@Processor('bridge-event-queue')
export class QueueProcessor {
  constructor(private readonly indexerService: IndexerService) {}
  @Process()
  async handleJob(job: Job<any>) {
    try {
      console.log('Processing job:', job.data);
      await this.indexerService.processEvents(job.data);
    } catch (err) {
      console.log(`err while processing message from queue `, err);
    }
  }
}
