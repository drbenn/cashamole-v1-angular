import { Injectable } from '@nestjs/common';
import { ChipDto } from './chip-dto/chip-dto';
import { InjectClient } from 'nest-mysql';
import { Connection } from 'mysql2';

@Injectable()
export class ChipService {

    constructor(@InjectClient() private readonly connection: Connection) {}

    async createNewChip(chipDto: ChipDto, userId: number): Promise<ChipDto | 'insert error' | 'undefined userid' > {
        if (!userId) {
            return 'undefined userid';
        };
        const sqlQuery: string = `INSERT INTO user${userId}_chips (kind, chip, status) 
            VALUES (
                \'${chipDto.kind}\', 
                \'${chipDto.chip}\', 
                \'${chipDto.status}\'
            )`;
        const newChip = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], newChip[0]);
        if (results.affectedRows === 1) {
            const completeChip: ChipDto = chipDto;
            completeChip.id = results.insertId;
            return completeChip;
        } else {
            return 'insert error';
        };
    };
}
