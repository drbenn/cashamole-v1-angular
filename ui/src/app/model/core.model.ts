export interface BalanceSheetEntry {
    record_id?: number,
    date: Date;
    amount: number;
    type: string | 'asset' | 'liability';
    description: string;
    status?: string;
}

export interface Income {
    inc_id?: number;
    date: Date;
    amount: number;
    source: string;
    note: string;
    status?: string | 'active' | 'cancelled';
}

export interface Expense {
    exp_id?: number;
    date: Date;
    amount: number;
    category: string;
    vendor: string;
    note: string;
    status?: string | 'active' | 'cancelled';
}