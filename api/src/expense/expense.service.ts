import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { ExpenseDto } from './expense-dto/expense-dto';

@Injectable()
export class ExpenseService {

    constructor(
        @InjectClient() private readonly connection: Connection
        ) {}

    async postNewExpense(expenseDto: ExpenseDto, userId: number): Promise<ExpenseDto | 'insert error' | 'undefined userid' > {
        
        if (!userId) {
            return 'undefined userid';
        };
        const sqlQuery: string = `INSERT INTO user${userId}_expenses (date, amount, category, vendor, note, status) 
            VALUES (
                \'${expenseDto.date}\',
                \'${expenseDto.amount}\', 
                \'${expenseDto.category}\',
                \'${expenseDto.vendor}\',
                \'${expenseDto.note}\',
                \'${expenseDto.status}\'
            )`;        
        const newExpense = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], newExpense[0]);
        if (results.affectedRows === 1) {
            const completeTransaction: ExpenseDto = expenseDto;
            completeTransaction.exp_id = results.insertId;
            return completeTransaction;
        } else {
            return 'insert error';
        };
    };
}
