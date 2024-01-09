import { BalanceRecordDto } from "src/balance_sheet/balance_sheet-dto/balance_sheet-dto";
import { ChipDto } from "src/chip/chip-dto/chip-dto";
import { ExpenseDto } from "src/expense/expense-dto/expense-dto";
import { IncomeDto } from "src/income/income-dto/income-dto";
import { InvestDto } from "src/invest/invest-dto/invest-dto";

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

export class UserLoginData {
    basicProfile: UserBasicProfile;
    income: IncomeDto[];
    investments: InvestDto[];
    expenses: ExpenseDto[];
    balanceSheetEntries: BalanceRecordDto[] | null;
    chips: ChipDto[] | null;
}
