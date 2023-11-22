import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, 
    { 
      cors: {
        credentials: true,
        allowedHeaders: ['content-type', 'application/x-www-form-urlencoded'],
        origin: [process.env.CLIENT_ORIGIN],
        methods: ['GET', 'PUT', 'PATCH', 'POST']
    } 
  });
  // app.enableCors();
  app.use(cookieParser());
  app.setGlobalPrefix(process.env.API_ENDPOINT_PREFIX);
  // enable CORS
  // enable CORS specific origin
  // app.enableCors({
  //   origin: 'http://localhost:4200',
  // });
  
  await app.listen(process.env.PORT);
}
bootstrap();
