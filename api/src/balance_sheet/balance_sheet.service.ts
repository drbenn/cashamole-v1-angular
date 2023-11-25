import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { BalanceRecordDto } from './balance_sheet-dto/balance_sheet-dto';

@Injectable()
export class BalanceSheetService {
    
    constructor(@InjectClient() private readonly connection: Connection) {}

    async postNewBalanceRecord(balanceRecordDto: BalanceRecordDto, userId: number): Promise<BalanceRecordDto | 'insert error'> {
        const sqlQuery: string = `INSERT INTO user${userId}_bal_sheet (date, amount, type, description, status) 
            VALUES (
                \'${balanceRecordDto.date}\', 
                \'${balanceRecordDto.amount}\', 
                \'${balanceRecordDto.type}\',
                \'${balanceRecordDto.description}\',
                \'${balanceRecordDto.status}\'
            )`;
        const newBalanceRecord = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], newBalanceRecord[0]);
        if (results.affectedRows === 1) {
            const completeBalanceRecord: BalanceRecordDto = balanceRecordDto;
            completeBalanceRecord.record_id = results.insertId;
            return completeBalanceRecord;
        } else {
            return 'insert error';
        };
    };

}
