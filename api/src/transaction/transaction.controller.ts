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
            const newTransaction: boolean = await this.transactionService.postNewTransaction(transactionDto, userId);
            if (!newTransaction) {
                throw new HttpException('transaction failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'transaction successful', data: JSON.stringify(newTransaction)});
            };
        }
    };  


}
