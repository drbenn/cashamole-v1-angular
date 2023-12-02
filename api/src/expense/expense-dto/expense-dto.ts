export class ExpenseDto {
    exp_id?: number;
    date: Date;
    amount: number;
    category: string;
    vendor: string;
    note: string;
    status: string | 'active' | 'cancelled';
}
