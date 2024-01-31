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

export interface Invest {
    inv_id?: number;
    date: Date;
    amount: number;
    institution: string;
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

export interface BasicApiResponse {
    message: string,
    data: any
}

export interface DashboardHistoryData {
    expenses: DashboardHistoryExpense[],
    income: DashboardHistoryIncome[],
    investments: DashboardHistoryInvestment[],
    balances: DashboardHistoryBalance[]
}

export interface DashboardHistoryExpense {
    unique_date: string,
    category: string,
    total_expense: string,
}

export interface DashboardHistoryIncome {
    unique_date: string,
    source: string,
    total_income: string,
}

export interface DashboardHistoryInvestment {
    unique_date: string,
    institution: string,
    total_invest: string,
}

export interface DashboardHistoryBalance {
    unique_date: string,
    type: string | 'asset' | 'liability',
    description: string,
    total_balance: string,
}

export interface DashboardHistoryNetWorth {
    unique_date: string,
    net_worth: string,
}

export interface DashboardHistoryCashFlow{
    unique_date: string,
    cash_flow: string,
}

