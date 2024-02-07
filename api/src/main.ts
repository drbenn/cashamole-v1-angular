import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

// this CORS config works perfectly in dev

//   cors: {
//     credentials: true,
//     allowedHeaders: ['content-type'],
//     // origin: [process.env.CLIENT_ORIGIN],
//     origin: ['http://localhost:4200'],  // todo: implement environment variable
//     methods: ['GET', 'PUT', 'PATCH', 'POST']
// }
async function bootstrap() {
  // // Barebones setup with open CORS
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('mole-apiv1'); // todo: implement environment variable
  app.enableCors({
    credentials: true,
    origin: true, // allows all origins
  });
  app.use(cookieParser());
  await app.listen(process.env.SERVER_PORT || 3006); // todo: implement environment variable

    // Advanced setup with open specified CORS domain
    // const app = await NestFactory.create(AppModule);
    // app.setGlobalPrefix('mole-apiv1'); // todo: implement environment variable
    // app.enableCors({
    //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    //   credentials: true,
    //   allowedHeaders: ['Access-Control-Allow-Credentials', 'content-type'],
    //   origin: ['http://localhost:4200/', 'https://cashamole.com'],
    //   optionsSuccessStatus: 200
    //   // origin: true, // allows all origins
    // });

    // app.use(cookieParser());
    // await app.listen(process.env.SERVER_PORT || 3006); // todo: implement environment variable






  // const app = await NestFactory.create(AppModule,
  //   {
  //     cors: {
  //       credentials: true,
  //       allowedHeaders: ['Access-Control-Allow-Credentials', 'content-type'],
  //       methods: ['GET', 'PUT', 'PATCH', 'POST']
  //     }
  //     });
  // app.setGlobalPrefix(process.env.API_ENDPOINT_PREFIX);
  // app.enableCors({
  //   credentials: true,
  //   methods: ['GET', 'PUT', 'PATCH', 'POST'],
  //   origin: true, // allows all origins
  //   // origin: [
  //   //   "http://localhost:4000/",
  //   //   "http://cashamole.com",
  //   //   "https://cashamole.com"
  //   // ], // more restrictive allowed origins
  //   allowedHeaders: ['content-type'], // orignal functioning config
  //   // allowedHeaders: ['Access-Control-Allow-Credentials', 'content-type'], // additional config to consider
  // })
  // app.enableCors({
  //   credentials: true,
  //   // methods: ['GET', 'PUT', 'PATCH', 'POST'],
  //   origin: true, // allows all origins
  //   // origin: [
  //   //   "http://localhost:4200/",
  //   //   "http://cashamole.com",
  //   //   "https://cashamole.com",
  //   //   "http://www.cashamole.com",
  //   //   "https//www.cashamole.com",
  //   // ], // more restrictive allowed origins
  //   // allowedHeaders: ['content-type'], // orignal functioning config
  //   // allowedHeaders: ['Access-Control-Allow-Credentials', 'Access-Control-Allow-Origin', 'content-type'], // additional config to consider
  // });
  // app.use(cookieParser());

  // await app.listen(process.env.PORT);
  // await app.listen(process.env.SERVER_PORT || 3006); // todo: implement environment variable
}
bootstrap();
