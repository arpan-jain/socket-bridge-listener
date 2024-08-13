import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('bridge-event-queue') private readonly bridgeEventQueue: Queue,
  ) {}

  async addJob(data: any) {
    await this.bridgeEventQueue.add(data);
  }
}
