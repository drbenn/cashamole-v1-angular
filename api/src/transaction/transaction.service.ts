import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { TransactionDto } from './transaction-dto/transaction-dto';
import { ChipService } from 'src/chip/chip.service';
import { ChipDto } from 'src/chip/chip-dto/chip-dto';

@Injectable()
export class TransactionService {

    constructor(
        @InjectClient() private readonly connection: Connection,
        private chipService: ChipService
        ) {}

    async postNewTransaction(transactionDto: TransactionDto, userId: number): Promise<TransactionDto | 'insert error' | 'undefined userid' > {
        
        if (!userId) {
            return 'undefined userid';
        };
        const chip: ChipDto = {kind: transactionDto.category, chip: transactionDto.vendor, status: 'active'};
        this.chipService.createNewChip(chip, userId);
        const sqlQuery: string = `INSERT INTO user${userId}_transactions (date, type, amount, category, vendor, note, status) 
            VALUES (
                \'${transactionDto.date}\',
                \'${transactionDto.type}\', 
                \'${transactionDto.amount}\', 
                \'${transactionDto.category}\',
                \'${transactionDto.vendor}\',
                \'${transactionDto.note}\',
                \'${transactionDto.status}\'
            )`;
        const newTransaction = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], newTransaction[0]);
        if (results.affectedRows === 1) {
            const completeTransaction: TransactionDto = transactionDto;
            completeTransaction.trans_id = results.insertId;
            return completeTransaction;
        } else {
            return 'insert error';
        };
    };

}
