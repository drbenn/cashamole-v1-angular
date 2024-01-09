export class IncomeDto {
    inc_id?: number;
    date: Date;
    amount: number;
    source: string;
    note: string;
    status: string | 'active' | 'cancelled';
}
