import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { connect, Connection, Channel, ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private messages: string[] = [];

  constructor() {
    this.connectAndConsume();
  }

  async onModuleInit() {
    await this.connect();
    await this.consumeFromQueue('my_queue', this.handleMessage);
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

  async connect() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
  }

  async sendToQueue(queue: string, message: string) {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async sendToFanoutExchange(exchange: string, message: string) {
    await this.channel.assertExchange(exchange, 'fanout', { durable: true });
    this.channel.publish(exchange, '', Buffer.from(message));
  }

  async consumeFromQueue(queue: string, callback: (msg: amqp.Message) => void) {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, (msg) => {
      if (msg !== null) {
        callback(msg);
        this.channel.ack(msg);
      }
    });
  }

  private async connectAndConsume() {
    const connection: Connection = await connect('amqp://localhost');
    const channel: Channel = await connection.createChannel();
    await channel.assertQueue('myQueue', { durable: false });
    channel.consume('myQueue', (msg: ConsumeMessage | null) => {
      if (msg) {
        this.messages.push(msg.content.toString());
        console.log(`Received message: ${msg.content.toString()}`);
      }
    });
  }

  public getMessages(): string[] {
    return this.messages;
  }

  handleMessage(msg: amqp.Message) {
    console.log(`Received message: ${msg.content.toString()}`);
    this.messages.push(msg.content.toString());
  }

  async bindQueueToFanoutExchange(queue: string, exchange: string) {
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.assertExchange(exchange, 'fanout', { durable: true });
    await this.channel.bindQueue(queue, exchange, '');
  }
}
