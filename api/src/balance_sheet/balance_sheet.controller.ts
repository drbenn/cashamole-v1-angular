import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { BalanceSheetService } from './balance_sheet.service';
import { BalanceRecordDto } from './balance_sheet-dto/balance_sheet-dto';
import { Request, Response } from 'express';

@Controller('balance-sheet')
export class BalanceSheetController {

    constructor(private balanceSheetService: BalanceSheetService) {}
    
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
}
