export class TransactionDto {
    trans_id?: number;
    date: Date;
    amount: number;
    category: string;
    payee: string;
    note: string;
    status: string;
}
