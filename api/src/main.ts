import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, 
    { 
      cors: {
        credentials: true,
        allowedHeaders: ['content-type'],
        // origin: [process.env.CLIENT_ORIGIN],
        origin: ['http://localhost:4200'],  // todo: implement environment variable
        methods: ['GET', 'PUT', 'PATCH', 'POST']
    } 
  });
  // app.enableCors();
  app.use(cookieParser());
  // app.setGlobalPrefix(process.env.API_ENDPOINT_PREFIX);
  // app.setGlobalPrefix('apiv1'); // todo: implement environment variable
  // enable CORS
  // enable CORS specific origin
  // app.enableCors({
  //   origin: 'http://localhost:4200',
  // });
  
  // await app.listen(process.env.PORT);
  await app.listen(3001);   // todo: implement environment variable
}
bootstrap();
