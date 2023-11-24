export interface TransactionBody {
    date: Date;
    amount: number;
    category: string;
    payee: string;
    note: string;
    status?: string;
  }