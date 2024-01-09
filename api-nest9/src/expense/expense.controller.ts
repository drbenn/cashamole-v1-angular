import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ExpenseService } from './expense.service';
import { ExpenseDto } from './expense-dto/expense-dto';
import { IncomeDto } from 'src/income/income-dto/income-dto';

@Controller('expense')
export class ExpenseController {

    constructor(private expenseService: ExpenseService) {}

    // @Get()
    // async getActiveExpenseRecords(
    //     @Req() req: Request, 
    //     @Param() params: any,
    //     @Res() res: Response
    //   ) {
    //     if (!req.cookies) {
    //         console.log('throw error');
    //         // todo: throw error
    //     }  else {
    //         const userId: number = params.id;
    //         const activeExpenseRecords: ExpenseDto[] | 'get error' | 'undefined userid' =  await this.expenseService.getActiveExpenses(userId);

    //         if (activeExpenseRecords === 'get error' || activeExpenseRecords === 'undefined userid') {
    //             throw new HttpException('expense records get failed', HttpStatus.BAD_REQUEST);
    //         } else {
    //             res.status(HttpStatus.OK).send({message: 'expense records get successful', data: JSON.stringify(activeExpenseRecords)});
    //         };
    //     };
    // };

    @Get(':id')
    async getActiveMonthExpenseRecords(
        @Req() req: Request, 
        @Param() params: any,
        @Res() res: Response
      ) {
        if (!req.cookies) {
            console.log('throw error');
            // todo: throw error
        }  else {
            const userId: number = req.cookies.cashamole_uid;
            const yearMonthString: string = params.id;
            
            const activeMonthExpenseRecords: ExpenseDto[] | 'get error' | 'undefined userid' =  await this.expenseService.getAllActiveExpenseRecordsByMonth(userId, yearMonthString);

            if (activeMonthExpenseRecords === 'get error' || activeMonthExpenseRecords === 'undefined userid') {
                throw new HttpException('expense records get failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'expense records get successful', data: JSON.stringify(activeMonthExpenseRecords)});
            };
        };
    };
    
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

    @Patch()
    async editExpenseRecord(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() expenseRecordDto: ExpenseDto
        ) {  
        if (!req.cookies) {
            console.log('throw no cookie error');
            // todo: throw error
        }  else {
            const userId: number = req.cookies.cashamole_uid;
            const newUpdateRecord: ExpenseDto | 'update error' | 'undefined userid' = await this.expenseService.updateExpenseRecord(expenseRecordDto, userId);

            if (newUpdateRecord === 'update error' || newUpdateRecord ===  'undefined userid') {
                throw new HttpException('expense record update failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'expense record update successful', data: JSON.stringify(newUpdateRecord)});
            };
        };
    };

    @Patch('/deactivate')
    async deactivateExpenseRecord(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() requestBody: {exp_id: number}
        ) {  
        if (!req.cookies) {
            console.log('throw no cookie error');
            // todo: throw error
        }  else {
            const userId: number = req.cookies.cashamole_uid;
            const recordId: number = requestBody.exp_id;
            const deactivateRecord: ExpenseDto | 'deactivate error' | 'undefined userid' = await this.expenseService.deactivateExpenseRecord(recordId, userId);

            if (deactivateRecord === 'deactivate error' || deactivateRecord ===  'undefined userid') {
                throw new HttpException('expense record deactivate failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'expense record deactivate successful', data: JSON.stringify(deactivateRecord)});
            };
        };
    }; 

}
