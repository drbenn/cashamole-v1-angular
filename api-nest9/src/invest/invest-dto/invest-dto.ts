export class InvestDto {
    inv_id?: number;
    date: Date;
    amount: number;
    institution: string;
    note?: string;
    status: string | 'active' | 'cancelled';
}
