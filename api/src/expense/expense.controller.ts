import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ExpenseService } from './expense.service';
import { ExpenseDto } from './expense-dto/expense-dto';

@Controller('expense')
export class ExpenseController {

    constructor(private expenseService: ExpenseService) {}
    
    @Post()
    async newTransaction(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() expenseDto: ExpenseDto
        ) {  
        if (!req.cookies) {
            console.log('throw error');
            // todo: throw error
        }  else {
            const userId: number = req.cookies.cashamole_uid;    
            const newTransaction: ExpenseDto | 'insert error' | 'undefined userid' = await this.expenseService.postNewExpense(expenseDto, userId);
            
            if (newTransaction === 'insert error' || newTransaction === 'undefined userid') {
                throw new HttpException('expense insert failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'expense insert successful', data: JSON.stringify(newTransaction)});
            };
        };
    };  

}
