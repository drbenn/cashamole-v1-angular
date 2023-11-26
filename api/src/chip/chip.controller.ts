import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ChipDto } from './chip-dto/chip-dto';
import { Request, Response } from 'express';
import { ChipService } from './chip.service';

@Controller('chip')
export class ChipController {

    constructor(private chipService: ChipService) {}

    @Post()
    async newChip(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() chipDto: ChipDto
        ) {  
        if (!req.cookies) {
            console.log('throw no cookie error');
            // todo: throw error
        }  else {
            const userId: number = req.cookies.cashamole_uid;
            
            const newInsertedChip: ChipDto | 'insert error' | 'undefined userid' = await this.chipService.createNewChip(chipDto, userId);

            if (newInsertedChip === 'insert error' || newInsertedChip ===  'undefined userid') {
                throw new HttpException('new chip insert failed', HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.OK).send({message: 'chip insert successful', data: JSON.stringify(newInsertedChip)});
            };
        };
    };  



}
