import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';

import { Request, Response } from 'express';
import { IncomeService } from './income.service';
import { IncomeDto } from './income-dto/income-dto';

@Controller('income')
export class IncomeController {

    constructor(private incomeService: IncomeService) {}
    
    @Post()
    async newTransaction(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() incomeDto: IncomeDto
        ) {  
        if (!req.cookies) {
            console.log('throw error');
            // todo: throw error
        }  else {
            const userId: number = req.cookies.cashamole_uid;    
            const newIncome: IncomeDto | 'insert error' | 'undefined userid' = await this.incomeService.postNewIncome(incomeDto, userId);
            
            if (newIncome === 'insert error' || newIncome === 'undefined userid') {
                throw new HttpException('income insert failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'income insert successful', data: JSON.stringify(newIncome)});
            };
        };
    };  
}
