import { Body, Controller, HttpException, HttpStatus, Param, Patch, Post, Req, Res } from '@nestjs/common';

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

    @Patch()
    async editIncomeRecord(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() expenseRecordDto: IncomeDto
        ) {  
        if (!req.cookies) {
            console.log('throw no cookie error');
            // todo: throw error
        }  else {
            const userId: number = req.cookies.cashamole_uid;            
            const newUpdateRecord: IncomeDto | 'update error' | 'undefined userid' = await this.incomeService.updateIncomeRecord(expenseRecordDto, userId);

            if (newUpdateRecord === 'update error' || newUpdateRecord ===  'undefined userid') {
                throw new HttpException('income record update failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'income record update successful', data: JSON.stringify(newUpdateRecord)});
            };
        };
    };

    @Patch('/deactivate')
    async deactivateIncomeRecord(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() requestBody: {inc_id: number}
        ) {  
        if (!req.cookies) {
            console.log('throw no cookie error');
            // todo: throw error
        }  else {
            const userId: number = req.cookies.cashamole_uid;
            const recordId: number = requestBody.inc_id;
            const deactivateRecord: IncomeDto | 'deactivate error' | 'undefined userid' = await this.incomeService.deactivateIncomeRecord(recordId, userId);

            if (deactivateRecord === 'deactivate error' || deactivateRecord ===  'undefined userid') {
                throw new HttpException('income record deactivate failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'income record deactivate successful', data: JSON.stringify(deactivateRecord)});
            };
        };
    }; 
}
