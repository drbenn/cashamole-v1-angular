import { ExpenseDto } from "src/expense/expense-dto/expense-dto";
import { IncomeDto } from "src/income/income-dto/income-dto";

export class RegisterUserDto {
    email: string;
    username: string;
    password: string;
    status?: string;
}

export class InsertUser {
    insertSuccessful: boolean;
    userId: number;
    username: string;
    email: string;
}

export class UserExist { 
    userExist: boolean;
    username: boolean;
    email: boolean;
}

export class LoginUserDto {
    username: string;
    password: string;
}

export class UserBasicProfile {
    id: number;
    username: string;
    email: string;
    join_date: Date
}

export class UserTransaction {
    trans_id: number;
    date: Date;
    amount: number;
    category: string;
    vendor: string;
    note: string;
    active: boolean;
}

export class UserBalanceSheetEntry {
    record_id: number;
    date: Date;
    amount: number;
    type: string;
    description: string;
    active: boolean;
}

export class UserChip {
    chip_id: number;
    type: string;
    chip: string;
    active: boolean;
}

export class UserLoginData {
    basicProfile: UserBasicProfile;
    // transactions: UserTransaction[] | null;
    income: IncomeDto[];
    expenses: ExpenseDto[];
    balanceSheetEntries: UserBalanceSheetEntry[] | null;
    chips: UserChip[] | null;
}
