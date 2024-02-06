import { BalanceRecordDto } from "src/balance_sheet/balance_sheet-dto/balance_sheet-dto";
import { ExpenseDto } from "src/expense/expense-dto/expense-dto";
import { IncomeDto } from "src/income/income-dto/income-dto";
import { InvestDto } from "src/invest/invest-dto/invest-dto";

export class CoreDto {
    balanceSheetRecords: BalanceRecordDto[];
    expenseRecords: ExpenseDto[];
    incomeRecords: IncomeDto[];
    investRecords: InvestDto[];
}
