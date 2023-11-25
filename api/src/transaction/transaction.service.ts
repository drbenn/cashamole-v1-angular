import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { TransactionDto } from './transaction-dto/transaction-dto';

@Injectable()
export class TransactionService {

    constructor(@InjectClient() private readonly connection: Connection) {}

    async postNewTransaction(transactionDto: TransactionDto, userId: number): Promise<TransactionDto | 'insert error'> {
        const sqlQuery: string = `INSERT INTO user${userId}_transactions (date, amount, category, payee, note, status) 
            VALUES (
                \'${transactionDto.date}\', 
                \'${transactionDto.amount}\', 
                \'${transactionDto.category}\',
                \'${transactionDto.payee}\',
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
