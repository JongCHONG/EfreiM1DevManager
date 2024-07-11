import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { MessagesController } from './messages/messages.controller';

@Module({
  imports: [RabbitmqModule],
  controllers: [AppController, MessagesController],
  providers: [AppService],
})
export class AppModule {}
