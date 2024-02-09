import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

// basic totally unrestricted cors setup
// async function bootstrap() {
//   // // Barebones setup with open CORS
//   const app = await NestFactory.create(AppModule);
//   app.setGlobalPrefix('mole-apiv1'); // todo: implement environment variable
//   app.enableCors({
//     preflightContinue: false,
//     credentials: true,
//     origin: true, // allows all origins
//   });
//   app.use(cookieParser());
//   await app.listen(process.env.SERVER_PORT || 3006); // todo: implement environment variable

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('mole-apiv1'); // todo: implement environment variable
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Access-Control-Allow-Credentials', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Access-Control-Request-Headers', 'content-type'],
    preflightContinue: false,
    credentials: true,
    origin: ['http://localhost:4200','https://cashamole.com']
  });
  app.use(cookieParser());
  await app.listen(process.env.SERVER_PORT || 3006); // todo: implement environment variable
}
bootstrap();
