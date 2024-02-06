import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { CoreController } from './core.controller';
import { BalanceSheetModule } from 'src/balance_sheet/balance_sheet.module';
import { ExpenseModule } from 'src/expense/expense.module';
import { IncomeModule } from 'src/income/income.module';
import { InvestModule } from 'src/invest/invest.module';

@Module({
  providers: [CoreService],
  controllers: [CoreController],
  imports: [BalanceSheetModule, ExpenseModule, IncomeModule, InvestModule]
})
export class CoreModule {}

