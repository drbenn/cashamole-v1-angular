import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';

@Injectable()
export class TransactionService {

    constructor(@InjectClient() private readonly connection: Connection) {}

    async postNewTransaction(transactionDto, userId: number): Promise<any> {
        console.log('BOOYAH');
        
        console.log(transactionDto);
        console.log(userId);
        
          
        const sqlQuery: string = `INSERT INTO user${userId}_transactions (date, amount, category, vendor, note, active) 
            VALUES (
                \'${transactionDto.date}\', 
                \'${transactionDto.amount}\', 
                \'${transactionDto.category}\',
                \'${transactionDto.payee}\',
                \'${transactionDto.note}\',
                \'${transactionDto.active}\'
            )`;
        const newTransaction = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], newTransaction[0]);
        console.log(results);
        
        const success: boolean = results.affectedRows > 0 ? true : false;
        // return {insertSuccessful: success, userId: results.insertId, username: userRegisterDto.username, email: userRegisterDto.email};
    }

}
