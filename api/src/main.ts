import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // enable CORS
  app.enableCors();
  // enable CORS specific origin
  // app.enableCors({
  //   origin: 'http://localhost:4200',
  // });
  await app.listen(3300);
}
bootstrap();
