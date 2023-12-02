import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlModule } from 'nest-mysql';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { TransactionModule } from './transaction/transaction.module';
import { BalanceSheetModule } from './balance_sheet/balance_sheet.module';
import { ChipService } from './chip/chip.service';
import { ChipController } from './chip/chip.controller';
import { ExpenseModule } from './expense/expense.module';
import { IncomeModule } from './income/income.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    MysqlModule.forRoot({
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      user: process.env.DATABASE_USER,
      port: parseInt(process.env.DATABASE_PORT),      
  }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'from.user.name@gmail.com',
          pass: 'pass',
        }
      }
    }),
    AuthModule,
    TransactionModule,
    BalanceSheetModule,
    ExpenseModule,
    IncomeModule
  ],
  controllers: [AppController, ChipController],
  providers: [AppService, ChipService],
})
export class AppModule {}
