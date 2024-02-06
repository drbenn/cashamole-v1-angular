import { Injectable } from '@nestjs/common';
import { BalanceSheetService } from 'src/balance_sheet/balance_sheet.service';

import { IncomeService } from 'src/income/income.service';
import { InvestService } from 'src/invest/invest.service';
import { CoreDto } from './core-dto/core-dto';
import { BalanceRecordDto } from 'src/balance_sheet/balance_sheet-dto/balance_sheet-dto';
import { ExpenseDto } from 'src/expense/expense-dto/expense-dto';
import { IncomeDto } from 'src/income/income-dto/income-dto';
import { InvestDto } from 'src/invest/invest-dto/invest-dto';
import { ExpenseService } from 'src/expense/expense.service';

@Injectable()
export class CoreService {

    constructor(
        private balanceSheetService: BalanceSheetService,
        private expenseService: ExpenseService,
        private incomeService: IncomeService,
        private investService: InvestService
    ) {}

    async getAllActiveRecordsByMonth(userId: number, yearMonthString: string): Promise<CoreDto> {

        let activeMonthBalanceRecords: BalanceRecordDto[] | 'get error' | 'undefined userid' =  await this.balanceSheetService.getAllActiveBalanceRecordsByMonth(userId, yearMonthString);
        let activeMonthExpenseRecords: ExpenseDto[] | 'get error' | 'undefined userid' =  await this.expenseService.getAllActiveExpenseRecordsByMonth(userId, yearMonthString);
        let activeMonthIncomeRecords: IncomeDto[] | 'get error' | 'undefined userid' =  await this.incomeService.getAllActiveIncomeRecordsByMonth(userId, yearMonthString);
        let activeMonthInvestRecords: InvestDto[] | 'get error' | 'undefined userid' =  await this.investService.getAllActiveInvestRecordsByMonth(userId, yearMonthString);

        if (activeMonthBalanceRecords === 'get error' || activeMonthBalanceRecords === 'undefined userid') {
            activeMonthBalanceRecords = [];
        };
        if (activeMonthExpenseRecords === 'get error' || activeMonthExpenseRecords === 'undefined userid') {
            activeMonthExpenseRecords = [];
        };
        if (activeMonthIncomeRecords === 'get error' || activeMonthIncomeRecords === 'undefined userid') {
            activeMonthIncomeRecords = [];
        };
        if (activeMonthInvestRecords === 'get error' || activeMonthInvestRecords === 'undefined userid') {
            activeMonthInvestRecords = [];
        };

        const activeMonthRecords: CoreDto = {
            balanceSheetRecords: activeMonthBalanceRecords,
            expenseRecords: activeMonthExpenseRecords,
            incomeRecords: activeMonthIncomeRecords,
            investRecords: activeMonthInvestRecords,
        };

        // const activeMonthRecords: CoreDto = {
        //     balanceSheetRecords: [],
        //     expenseRecords: [],
        //     incomeRecords: [],
        //     investRecords: [],
        // };
        
        return activeMonthRecords;
    };


}
