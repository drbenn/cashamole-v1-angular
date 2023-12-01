export interface TransactionBody {
    trans_id?: number;
    type: string | 'income' | 'expense';
    date: Date;
    amount: number;
    category: string | 'income'; // if income will also be set to income on submit of new transaction
    vendor: string; // doubles as income source for income type
    note: string;
    status?: string;
  }