import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as WebSocket from 'ws';


async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const corsOptions: CorsOptions = {
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    };
    app.enableCors(corsOptions);

    await app.listen(5000);
}
bootstrap();
