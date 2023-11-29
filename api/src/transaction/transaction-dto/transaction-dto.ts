export class TransactionDto {
    trans_id?: number;
    type: 'income' | 'expense';
    date: Date;
    amount: number;
    category: string;
    vendor: string;
    note: string;
    status: string;
}
