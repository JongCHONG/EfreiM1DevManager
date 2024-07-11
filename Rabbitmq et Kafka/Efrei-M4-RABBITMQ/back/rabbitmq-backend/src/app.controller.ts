import { Controller, Get } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';

@Controller()
export class AppController {
    constructor(private readonly rabbitmqService: RabbitmqService) {}

    @Get('start-consume-fanout')
    async startConsumeFanout() {
        const queue = 'my_fanout_queue';
        const exchange = 'my_fanout_exchange';
        await this.rabbitmqService.bindQueueToFanoutExchange(queue, exchange);
        await this.rabbitmqService.consumeFromQueue(queue, this.rabbitmqService.handleMessage.bind(this.rabbitmqService));
        return 'Started consuming messages from fanout exchange!';
    }

    @Get('send-to-queue')
    async sendToQueue() {
        await this.rabbitmqService.sendToQueue('my_queue', 'Hello, Queue!');
        return 'Message sent to queue!';
    }

    @Get('send-to-fanout-exchange')
    async sendToFanoutExchange() {
        await this.rabbitmqService.sendToFanoutExchange('my_fanout_exchange', 'Hello, Fanout Exchange!');
        return 'Message sent to fanout exchange!';
    }
}
