import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { BalanceSheetService } from './balance_sheet.service';
import { BalanceRecordDto } from './balance_sheet-dto/balance_sheet-dto';
import { Request, Response } from 'express';

@Controller('balance-sheet')
export class BalanceSheetController {

    constructor(private balanceSheetService: BalanceSheetService) {}

    
    @Get(':id')
    async getActiveMonthBalanceRecords(
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
            
            const activeMonthBalanceRecords: BalanceRecordDto[] | 'get error' | 'undefined userid' =  await this.balanceSheetService.getAllActiveBalanceRecordsByMonth(userId, yearMonthString);

            if (activeMonthBalanceRecords === 'get error' || activeMonthBalanceRecords === 'undefined userid') {
                throw new HttpException('balance records get failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'balance records get successful', data: JSON.stringify(activeMonthBalanceRecords)});
            };
        };
    };


    @Post()
    async newBalanceRecord(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() balanceRecordDto: BalanceRecordDto
        ) {  
        if (!req.cookies) {
            console.log('throw no cookie error');
            // todo: throw error
        }  else {
            const userId: number = req.cookies.cashamole_uid;
            
            const newInsertedRecord: BalanceRecordDto | 'insert error' | 'undefined userid' = await this.balanceSheetService.postNewBalanceRecord(balanceRecordDto, userId);

            if (newInsertedRecord === 'insert error' || newInsertedRecord ===  'undefined userid') {
                throw new HttpException('balance sheet record insert failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'balance insert successful', data: JSON.stringify(newInsertedRecord)});
            };
        };
    };  

    @Patch()
    async editBalanceRecord(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() balanceRecordDto: BalanceRecordDto
        ) {  
        if (!req.cookies) {
            console.log('throw no cookie error');
            // todo: throw error
        }  else {
            const userId: number = req.cookies.cashamole_uid;
            const newUpdateRecord: BalanceRecordDto | 'update error' | 'undefined userid' = await this.balanceSheetService.updateBalanceRecord(balanceRecordDto, userId);

            if (newUpdateRecord === 'update error' || newUpdateRecord ===  'undefined userid') {
                throw new HttpException('balance sheet record update failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'balance record update successful', data: JSON.stringify(newUpdateRecord)});
            };
        };
    };

    @Patch('/deactivate')
    async deactivateBalanceRecord(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() requestBody: {record_id: number}
        ) {  
        if (!req.cookies) {
            console.log('throw no cookie error');
            // todo: throw error
        }  else {
            const userId: number = req.cookies.cashamole_uid;
            const recordId: number = requestBody.record_id;
            const deactivateRecord: BalanceRecordDto | 'deactivate error' | 'undefined userid' = await this.balanceSheetService.deactivateBalanceRecord(recordId, userId);

            if (deactivateRecord === 'deactivate error' || deactivateRecord ===  'undefined userid') {
                throw new HttpException('balance record deactivate failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'balance record deactivate successful', data: JSON.stringify(deactivateRecord)});
            };
        };
    }; 

}
