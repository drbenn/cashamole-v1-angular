import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ChipService } from 'src/chip/chip.service';

@Module({
  providers: [TransactionService, ChipService],
  controllers: [TransactionController]
})
export class TransactionModule {}
