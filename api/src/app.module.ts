import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MysqlModule } from 'nest-mysql';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { BalanceSheetModule } from './balance_sheet/balance_sheet.module';
import { ChipService } from './chip/chip.service';
import { ChipController } from './chip/chip.controller';
import { ExpenseModule } from './expense/expense.module';
import { IncomeModule } from './income/income.module';
import { InvestController } from './invest/invest.controller';
import { InvestService } from './invest/invest.service';
import { InvestModule } from './invest/invest.module';
import { MailerModule } from '@nestjs-modules/mailer';




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
  //   MysqlModule.forRoot({
  //     host: 'localhost',
  //     database: 'cashamole',
  //     password: 'pass',
  //     user: 'root',
  //     port: 3306,      
  // }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT), 
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.PASSWORD,
        }
      }
    }),
    AuthModule,
    TransactionModule,
    BalanceSheetModule,
    ExpenseModule,
    IncomeModule,
    InvestModule,
    MailerModule
 
  ],
  controllers: [AppController, ChipController, InvestController],
  providers: [AppService, ChipService, InvestService],
})
export class AppModule {}