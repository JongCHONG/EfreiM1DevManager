import { Controller, Get } from '@nestjs/common';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  @Get()
  getMessages(): string[] {
    return this.rabbitmqService.getMessages();
  }
}