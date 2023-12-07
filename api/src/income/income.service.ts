import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { IncomeDto } from './income-dto/income-dto';


@Injectable()
export class IncomeService {

    constructor(
        @InjectClient() private readonly connection: Connection
        ) {}

    async postNewIncome(incomeDto: IncomeDto, userId: number): Promise<IncomeDto | 'insert error' | 'undefined userid' > {
        console.log('in post income');
        
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
}
