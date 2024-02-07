import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { InvestDto } from './invest-dto/invest-dto';


@Injectable()
export class InvestService {

    constructor(
        @InjectClient() private readonly connection: Connection
    ) {}

    async getAllActiveInvestRecordsByMonth(userId: number, yearMonthString: string): Promise<InvestDto[] | 'get error' | 'undefined userid'> {
        if (userId === undefined) { 
            return 'undefined userid' 
        };
        const sqlQuery: string = `SELECT * FROM user${userId}_invest WHERE status != 'deactivated' AND date LIKE '${yearMonthString}%' ORDER BY date ASC;`;
        // console.log(sqlQuery);
        
        const userInvestRecords = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], userInvestRecords[0]);
        if (Object.keys(results[0]).length === 0 && results.length === 1) {
            return null;
        } else {
            return results;
        };
    };

    async postNewInvest(investDto: InvestDto, userId: number): Promise<InvestDto | 'insert error' | 'undefined userid' > {
        if (!userId) {
            return 'undefined userid';
        };
        const sqlQuery: string = `INSERT INTO user${userId}_invest (date, amount, institution, note, status) 
            VALUES (
                \'${investDto.date}\',
                \'${investDto.amount}\', 
                \'${investDto.institution}\',
                \'${investDto.note}\',
                \'${investDto.status}\'
            )`;        
        const newInvest = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], newInvest[0]);
        if (results.affectedRows === 1) {
            const completeTransaction: InvestDto = investDto;
            completeTransaction.inv_id = results.insertId;
            return completeTransaction;
        } else {
            return 'insert error';
        };
    };

    async updateInvestRecord(investDto: InvestDto, userId: number): Promise<InvestDto | 'update error' | 'undefined userid' > {
        if (!userId) {
            return 'undefined userid';
        };
        const sqlQuery: string = `
        UPDATE user${userId}_invest 
        SET date = '${investDto.date}', amount = ${investDto.amount}, institution = '${investDto.institution}', 
        note = '${investDto.note}'
        WHERE inv_id = ${investDto.inv_id};`;
        
        const udpateInvestRecord = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], udpateInvestRecord[0]);
        if (results.affectedRows === 1) {
            const completeInvestRecord: InvestDto = investDto;
            completeInvestRecord.inv_id = results.insertId;
            return completeInvestRecord;
        } else {
            return 'update error';
        };
    };

    async deactivateInvestRecord(recordId: number, userId: number): Promise<InvestDto | 'deactivate error' | 'undefined userid' > {
        if (!userId) {
            return 'undefined userid';
        };
        const sqlQuery: string = `UPDATE user${userId}_invest
            SET status = 'deactivated' WHERE inv_id = ${recordId};`;
        const deactivatedInvestRecord = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], deactivatedInvestRecord[0]);
        if (results.affectedRows === 1) {
            return results;
        } else {
            return 'deactivate error';
        };
    };
}
