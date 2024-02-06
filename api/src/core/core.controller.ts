import { Controller, Get, HttpException, HttpStatus, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CoreDto } from './core-dto/core-dto';
import { CoreService } from './core.service';


@Controller('core')
export class CoreController {

    constructor(
        private coreService: CoreService
    ) {}

    @Get(':id')
    async getActiveMonthRecords(
        @Req() req: Request, 
        @Param() params: any,
        @Res() res: Response
      ) {
        if (!req.cookies) {
            throw new HttpException(
                'No user cookie with registered user authentication data available to retrieve month records.'
            , HttpStatus.BAD_REQUEST);
        }  else {
            const userId: number = req.cookies.cashamole_uid;
            const yearMonthString: string = params.id;

            const activeMonthRecords: CoreDto =  await this.coreService.getAllActiveRecordsByMonth(userId, yearMonthString);

            res.status(HttpStatus.OK)
                .send({message: 'active month records retrieved successfully', data: JSON.stringify(activeMonthRecords)});
        };

    };
}