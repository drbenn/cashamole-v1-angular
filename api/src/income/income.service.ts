import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { IncomeDto } from './income-dto/income-dto';


@Injectable()
export class IncomeService {

    constructor(
        @InjectClient() private readonly connection: Connection
        ) {}

    // async getActiveIncome(userId: number): Promise<IncomeDto[]> {
    //     const sqlQuery: string = `SELECT * FROM user${userId}_income WHERE status != 'deactivated' ORDER BY date ASC;`;
    //     const userIncome = await this.connection.query(sqlQuery);
    //     const results = Object.assign([{}], userIncome[0]);
    //     if (Object.keys(results[0]).length === 0 && results.length === 1) {
    //         return null;
    //     } else {
    //         return results;
    //     };
    // };

    async postNewIncome(incomeDto: IncomeDto, userId: number): Promise<IncomeDto | 'insert error' | 'undefined userid' > {
        if (!userId) {
            return 'undefined userid';
        };
        const sqlQuery: string = `INSERT INTO user${userId}_income (date, amount, source, note, status) 
            VALUES (
                \'${incomeDto.date}\',
                \'${incomeDto.amount}\', 
                \'${incomeDto.source}\',
                \'${incomeDto.note}\',
                \'${incomeDto.status}\'
            )`;        
        const newIncome = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], newIncome[0]);
        if (results.affectedRows === 1) {
            const completeTransaction: IncomeDto = incomeDto;
            completeTransaction.inc_id = results.insertId;
            return completeTransaction;
        } else {
            return 'insert error';
        };
    };

    async updateIncomeRecord(incomeDto: IncomeDto, userId: number): Promise<IncomeDto | 'update error' | 'undefined userid' > {
        if (!userId) {
            return 'undefined userid';
        };
        const sqlQuery: string = `
        UPDATE user${userId}_income 
        SET date = '${incomeDto.date}', amount = ${incomeDto.amount}, source = '${incomeDto.source}', 
        note = '${incomeDto.note}'
        WHERE inc_id = ${incomeDto.inc_id};`;

        const udpateIncomeRecord = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], udpateIncomeRecord[0]);
        if (results.affectedRows === 1) {
            const completeIncomeRecord: IncomeDto = incomeDto;
            completeIncomeRecord.inc_id = results.insertId;
            return completeIncomeRecord;
        } else {
            return 'update error';
        };
    };

    async deactivateIncomeRecord(recordId: number, userId: number): Promise<IncomeDto | 'deactivate error' | 'undefined userid' > {
        if (!userId) {
            return 'undefined userid';
        };
        const sqlQuery: string = `UPDATE user${userId}_income
            SET status = 'deactivated' WHERE inc_id = ${recordId};`;
        const deactivatedIncomeRecord = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], deactivatedIncomeRecord[0]);
        if (results.affectedRows === 1) {
            return results;
        } else {
            return 'deactivate error';
        };
    };
}
