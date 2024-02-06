import { Module } from '@nestjs/common';
import { InvestController } from './invest.controller';
import { InvestService } from './invest.service';

@Module({
    controllers: [InvestController],
    providers: [InvestService],
    exports: [InvestService]
})
export class InvestModule {}
