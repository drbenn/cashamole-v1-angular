import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { TransactionDto } from './transaction-dto/transaction-dto';
import { TransactionService } from './transaction.service';
import { Request, Response } from 'express';

@Controller('transaction')
export class TransactionController {

    constructor(private transactionService: TransactionService) {}
    
    @Post()
    async newTransaction(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() transactionDto: TransactionDto
        ) {  
        if (!req.cookies) {
            console.log('throw error');
            // todo: throw error
        }  else {
            const userId: number = req.cookies.cashamole_uid;    
            const newTransaction: TransactionDto | 'insert error' | 'undefined userid' = await this.transactionService.postNewTransaction(transactionDto, userId);
            
            if (newTransaction === 'insert error' || newTransaction === 'undefined userid') {
                throw new HttpException('transaction insert failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'transaction insert successful', data: JSON.stringify(newTransaction)});
            };
        };
    };  
}
