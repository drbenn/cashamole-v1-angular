import { Module } from '@nestjs/common';
import { BalanceSheetController } from './balance_sheet.controller';
import { BalanceSheetService } from './balance_sheet.service';


@Module({
  controllers: [BalanceSheetController],
  providers: [BalanceSheetService]
})
export class BalanceSheetModule {}
