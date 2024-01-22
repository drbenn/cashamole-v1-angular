import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { CoreApiService } from '../../api-services/core-api.service';
import { DashboardActions } from './dashboard.actions';
import { BalanceSheetEntry, DashboardHistoryBalance, DashboardHistoryExpense, DashboardHistoryIncome, DashboardHistoryInvestment, Expense, Income, Invest } from '../../models/core.model';




export interface DashboardStateModel {
    monthExpenses: number,
    monthIncome: number,
    monthInvest: number,
    monthPreTaxInvest: number,
    monthPostTaxInvest: number,
    monthNetCashFlow: number,
    monthAssets: number,
    monthLiabilities: number,
    monthNetWorth: number,
    expenseHistoryByMonth: DashboardHistoryExpense[],
    incomeHistoryByMonth: DashboardHistoryIncome[],
    investHistoryByMonth: DashboardHistoryInvestment[],
    balanceHistoryByMonth: DashboardHistoryBalance[]
}

@State<DashboardStateModel>({
  name: 'dashboard',
  defaults: {
    monthExpenses: 0,
    monthIncome: 0,
    monthInvest: 0,
    monthPreTaxInvest: 0,
    monthPostTaxInvest: 0,
    monthNetCashFlow: 0,
    monthAssets: 0,
    monthLiabilities: 0,
    monthNetWorth: 0,
    expenseHistoryByMonth: [],
    incomeHistoryByMonth: [],
    investHistoryByMonth: [],
    balanceHistoryByMonth: []
    },
  }
)
@Injectable()
export class DashboardState {
  constructor(
    private store: Store,
    private router: Router,
    private coreApi: CoreApiService
    ) {}

    @Action(DashboardActions.SetDashboardHistoryOnLogin)
    setDashboardHistoryOnLogin(
    ctx: StateContext<DashboardStateModel>,
    action: DashboardActions.SetDashboardHistoryOnLogin
  ) {

    console.log(action.payload);
    
    ctx.patchState({ 
      expenseHistoryByMonth: action.payload.expenses,
      incomeHistoryByMonth: action.payload.income,
      investHistoryByMonth: action.payload.investments,
      balanceHistoryByMonth: action.payload.balances
    });
  };


  @Action(DashboardActions.UpdateMonthExpenseTotal)
  updateMonthExpenseTotal(
    ctx: StateContext<DashboardStateModel>,
    action: DashboardActions.UpdateMonthExpenseTotal
  ) {
    let sum: number = 0;
    if ( action.payload === null) {
        ctx.patchState({ 
            monthExpenses: sum
        });
    } else {
        const income: number = <number>ctx.getState().monthIncome;
        sum = this.reduceToSum(action.payload);
        ctx.patchState({ 
            monthExpenses: sum,
            monthNetCashFlow: income - sum
        });
    };
  };

  @Action(DashboardActions.UpdateMonthIncomeTotal)
  updateMonthIncomeTotal(
    ctx: StateContext<DashboardStateModel>,
    action: DashboardActions.UpdateMonthIncomeTotal
  ) {
    let sum: number = 0;
    if ( action.payload === null) {
        ctx.patchState({ 
            monthIncome: sum
        });
    } else {
        const expenses: number = <number>ctx.getState().monthExpenses;
        sum = this.reduceToSum(action.payload);
        ctx.patchState({ 
            monthIncome: sum,
            monthNetCashFlow: sum - expenses
        });
    };
  };

  @Action(DashboardActions.UpdateMonthInvestTotal)
  updateMonthInvestTotal(
    ctx: StateContext<DashboardStateModel>,
    action: DashboardActions.UpdateMonthInvestTotal
  ) {
    let sum: number = 0;
    let sumPretax: number = 0;
    let sumPosttax: number = 0;
    if ( action.payload === null) {
        ctx.patchState({ 
            monthInvest: sum,
            monthPreTaxInvest: sumPretax,
            monthPostTaxInvest: sumPosttax,
        });
    } else {
        sum = this.reduceToSum(action.payload);
        sumPretax = this.reduceToSum(action.payload.filter((item: Invest) => item.institution.includes('401')));
        sumPosttax = this.reduceToSum(action.payload.filter((item: Invest) => !item.institution.includes('401')));
        ctx.patchState({ 
            monthInvest: sum,
            monthPreTaxInvest: sumPretax,
            monthPostTaxInvest: sumPosttax,
        });
    };
  };

  @Action(DashboardActions.UpdateMonthBalanceSheetTotal)
  updateMonthBalanceSheetTotal(
    ctx: StateContext<DashboardStateModel>,
    action: DashboardActions.UpdateMonthBalanceSheetTotal
  ) {
    let sum: number = 0;
    if ( action.payload === null) {
        ctx.patchState({ 
            monthAssets: 0,
            monthLiabilities: 0,
            monthNetWorth: 0
        });
    } else {
        let assets: number = 0;
        let liabilities: number = 0;
        let netWorth: number = 0;
        const assetArray: BalanceSheetEntry[] = [];
        const liabilityArray: BalanceSheetEntry[] = [];

        action.payload.forEach((entry: BalanceSheetEntry) => {
            if (entry.type === 'asset') {
                assetArray.push(entry);
            };
            if (entry.type === 'liability') {
                liabilityArray.push(entry)
            };
        })
        assets = this.reduceToSum(assetArray);
        liabilities = this.reduceToSum(liabilityArray);
        netWorth = assets - liabilities;
        ctx.patchState({ 
            monthAssets: assets,
            monthLiabilities: liabilities,
            monthNetWorth: netWorth
        });
    };
  };

  private reduceToSum(items: Expense[] | Income[] | BalanceSheetEntry[]): number {
    return items.reduce((accum: number, item: Expense | Income | BalanceSheetEntry) => accum + Number(item.amount), 0);
  }

//   @Action(ExpenseActions.GetAndSetMonthExpenseRecords)
//   getAndSetMonthExpenseRecords(
//     ctx: StateContext<ExpenseStateModel>,
//     action: ExpenseActions.GetAndSetMonthExpenseRecords
//   ) {
//     this.coreApi.getActiveExpenseRecordsByMonth(action.payload).subscribe((res: any) => {
//       if (res.data === 'null') {
//         ctx.patchState({ 
//           expenses: []
//         });
//       } else {
//         ctx.patchState({ 
//           expenses: JSON.parse(res.data)
//         });
//       };
//     });
//   };

//   @Action(ExpenseActions.AddExpense)
//   addExpense(
//     ctx: StateContext<ExpenseStateModel>,
//     action: ExpenseActions.AddExpense
//   ) {
//     let updatedExpenses: Expense[] = ctx.getState().expenses;
//     updatedExpenses === null ? updatedExpenses = [] : updatedExpenses = updatedExpenses; 
//     updatedExpenses.push(action.payload);
//     ctx.patchState({ expenses: updatedExpenses });
//   };

//   @Action(ExpenseActions.EditUserExpenseRecord)
//   editUserExpenseRecord(
//       ctx: StateContext<ExpenseStateModel>,
//       action: ExpenseActions.EditUserExpenseRecord
//   ) {
//     const year: string = action.payload.date.getFullYear().toString();
//     const month: string = (action.payload.date.getMonth() + 1).toString().padStart(2, '0');
//     const yearMonthId: string = `${year}-${month}`;
//     this.store.dispatch(new ExpenseActions.GetAndSetMonthExpenseRecords(yearMonthId));
//     // let currentExpenseRecords: Expense[] = ctx.getState().expenses;
//     // currentExpenseRecords === null ? currentExpenseRecords = [] : currentExpenseRecords = currentExpenseRecords; 
//     // const updatedExpenseRecords: Expense[] = [];
//     // currentExpenseRecords.forEach((record: Expense) => {
//     //   if (record.exp_id === action.payload.exp_id) {
//     //     updatedExpenseRecords.push(action.payload);
//     //   } else {
//     //     updatedExpenseRecords.push(record);
//     //   }
//     // })
//     // ctx.patchState({ expenses: updatedExpenseRecords });
//   };

//   @Action(ExpenseActions.DeactivateUserExpenseRecord)
//   deactivateUserExpenseRecord(
//       ctx: StateContext<ExpenseStateModel>,
//       action: ExpenseActions.DeactivateUserExpenseRecord
//   ) {
//       let currentExpenseRecords: Expense[] = ctx.getState().expenses;
//       currentExpenseRecords === null ? currentExpenseRecords = [] : currentExpenseRecords = currentExpenseRecords; 
//       const updatedExpenseRecords: Expense[] = [];
//       currentExpenseRecords.forEach((record: Expense) => {
//         if (record.exp_id !== action.payload.exp_id) {
//           updatedExpenseRecords.push(record);
//         };
//       });    
//       ctx.patchState({ expenses: updatedExpenseRecords });
//   };
}