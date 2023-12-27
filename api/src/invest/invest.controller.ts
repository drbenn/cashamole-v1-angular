import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { InvestService } from './invest.service';
import { InvestDto } from './invest-dto/invest-dto';


@Controller('invest')
export class InvestController {

    constructor(private investService: InvestService) {}

    @Get(':id')
    async getActiveMonthInvestRecords(
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
            
            const activeMonthInvestRecords: InvestDto[] | 'get error' | 'undefined userid' =  await this.investService.getAllActiveInvestRecordsByMonth(userId, yearMonthString);

            if (activeMonthInvestRecords === 'get error' || activeMonthInvestRecords === 'undefined userid') {
                throw new HttpException('invest records get failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'invest records get successful', data: JSON.stringify(activeMonthInvestRecords)});
            };
        };
    };

    
    @Post()
    async newInvest(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() investDto: InvestDto
        ) {  
        if (!req.cookies) {
            console.log('throw error');
            // todo: throw error
        }  else {
            const userId: number = req.cookies.cashamole_uid;    
            const newInvest: InvestDto | 'insert error' | 'undefined userid' = await this.investService.postNewInvest(investDto, userId);
            
            if (newInvest === 'insert error' || newInvest === 'undefined userid') {
                throw new HttpException('invest insert failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'invest insert successful', data: JSON.stringify(newInvest)});
            };
        };
    };

    @Patch()
    async editInvestRecord(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() investRecordDto: InvestDto
        ) {  
        if (!req.cookies) {
            console.log('throw no cookie error');
            // todo: throw error
        }  else {
            const userId: number = req.cookies.cashamole_uid;            
            const newUpdateRecord: InvestDto | 'update error' | 'undefined userid' = await this.investService.updateInvestRecord(investRecordDto, userId);

            if (newUpdateRecord === 'update error' || newUpdateRecord ===  'undefined userid') {
                throw new HttpException('invest record update failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'invest record update successful', data: JSON.stringify(newUpdateRecord)});
            };
        };
    };

    @Patch('/deactivate')
    async deactivateInvestRecord(
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
            const deactivateRecord: InvestDto | 'deactivate error' | 'undefined userid' = await this.investService.deactivateInvestRecord(recordId, userId);

            if (deactivateRecord === 'deactivate error' || deactivateRecord ===  'undefined userid') {
                throw new HttpException('invest record deactivate failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'invest record deactivate successful', data: JSON.stringify(deactivateRecord)});
            };
        };
    }; 
}

