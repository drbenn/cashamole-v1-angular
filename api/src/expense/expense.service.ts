import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { ExpenseDto } from './expense-dto/expense-dto';

@Injectable()
export class ExpenseService {

    constructor(
        @InjectClient() private readonly connection: Connection
    ) {}

    // async getAllActiveExpenseRecords(userId: number): Promise<ExpenseDto[] | 'get error' | 'undefined userid'> {
    //     const sqlQuery: string = `SELECT * FROM user${userId}_expenses WHERE status != 'deactivated' ORDER BY date ASC;`;
    //     const userExpenseRecords = await this.connection.query(sqlQuery);
    //     const results = Object.assign([{}], userExpenseRecords[0]);
    //     if (Object.keys(results[0]).length === 0 && results.length === 1) {
    //         return null;
    //     } else {
    //         return results;
    //     };
    // };

    async getAllActiveExpenseRecordsByMonth(userId: number, yearMonthString: string): Promise<ExpenseDto[] | 'get error' | 'undefined userid'> {
        if (userId === undefined) { 
            return 'undefined userid' 
        };
        const sqlQuery: string = `SELECT * FROM user${userId}_expenses WHERE status != 'deactivated' AND date LIKE '${yearMonthString}%' ORDER BY date ASC;`;
        const userExpenseRecords = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], userExpenseRecords[0]);
        if (Object.keys(results[0]).length === 0 && results.length === 1) {
            return null;
        } else {
            return results;
        };
    };

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

    async updateExpenseRecord(expenseDto: ExpenseDto, userId: number): Promise<ExpenseDto | 'update error' | 'undefined userid' > {
        if (!userId) {
            return 'undefined userid';
        };
        const sqlQuery: string = `
        UPDATE user${userId}_expenses
        SET date = '${expenseDto.date}', amount = ${expenseDto.amount}, category = '${expenseDto.category}', 
        vendor = '${expenseDto.vendor}', note = '${expenseDto.note}'
        WHERE exp_id = ${expenseDto.exp_id};`;

        const udpateExpenseRecord = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], udpateExpenseRecord[0]);
        if (results.affectedRows === 1) {
            const completeExpenseRecord: ExpenseDto = expenseDto;
            completeExpenseRecord.exp_id = results.insertId;
            return completeExpenseRecord;
        } else {
            return 'update error';
        };
    };

    async deactivateExpenseRecord(recordId: number, userId: number): Promise<ExpenseDto | 'deactivate error' | 'undefined userid' > {
        if (!userId) {
            return 'undefined userid';
        };        
        const sqlQuery: string = `UPDATE user${userId}_expenses
            SET status = 'deactivated' WHERE exp_id = ${recordId};`;
        const deactivatedIncomeRecord = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], deactivatedIncomeRecord[0]);
        if (results.affectedRows === 1) {
            return results;
        } else {
            return 'deactivate error';
        };
    };
}
