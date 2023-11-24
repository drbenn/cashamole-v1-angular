import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { TransactionDto } from './transaction-dto/transaction-dto';
import { TransactionService } from './transaction.service';
import { Request, Response } from 'express';

@Controller('transaction')
export class TransactionController {

    constructor(private transactionService: TransactionService) {}
    
    @Post()
    async newTransaction(
        @Res() res: Response, 
        @Body() transactionDto: TransactionDto
        ) {  
        console.log('in transaction');
              
        const userId = 18;
        const newTransaction: boolean = await this.transactionService.postNewTransaction(transactionDto, userId);
        if (!newTransaction) {
            throw new HttpException('transaction failed', HttpStatus.BAD_REQUEST);
        } else {
            res.status(HttpStatus.OK).send({message: 'transaction successful', data: JSON.stringify(newTransaction)});
        };
    };  


}
