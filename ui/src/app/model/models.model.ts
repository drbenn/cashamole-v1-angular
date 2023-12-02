import { Chip } from "./chips.model";

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

export interface BalanceSheetEntry {
    record_id?: number,
    date: Date;
    amount: number;
    type: string | 'asset' | 'liability';
    description: string;
    status?: string;
}

export interface ChipStateStructure {
    asset: Chip[],
    liability: Chip[],
    expense_category: Chip[],
    expense_vendor: Chip[],
    income_source: Chip[] 
  }


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
  