import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { MysqlModule } from 'nest-mysql';

@Module({
  imports: [
    MysqlModule.forRoot({
      host: 'localhost',
      database: 'cashamole',
      password: 'pass',
      user: 'root',
      port: 3306,      
  }),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
