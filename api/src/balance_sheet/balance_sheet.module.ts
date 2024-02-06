import { Module } from '@nestjs/common';
import { BalanceSheetController } from './balance_sheet.controller';
import { BalanceSheetService } from './balance_sheet.service';
import { ChipService } from 'src/chip/chip.service';


@Module({
  controllers: [BalanceSheetController],
  providers: [BalanceSheetService, ChipService],
  exports: [BalanceSheetService]
})
export class BalanceSheetModule {}
