import { BalanceSheetEntryBody } from "./balanceSheet.model";
import { Chip } from "./chips.model";
import { TransactionBody } from "./transaction.model";

export interface UserRegister {
    email: string,
    username: string,
    password: string
}

export interface UserLogin {
    username: string,
    password: string
}






export interface User {
    id?: number;
    username: string;
    email: string;
    join_date?: string;
}

export interface UserLoginData {
    profile: User,
    transactions: TransactionBody[],
    balanceSheetEntries: BalanceSheetEntryBody[],
    chips: Chip[],
}