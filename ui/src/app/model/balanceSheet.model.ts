export interface BalanceSheetEntryBody {
    record_id?: number,
    date: Date;
    amount: number;
    type: string;
    description: string;
    status?: string;
}