import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { CoreApiService } from '../../api-services/core-api.service';
import { DashboardActions } from './dashboard.actions';
import { BalanceSheetEntry, DashboardHistoryBalance, DashboardHistoryExpense, DashboardHistoryIncome, DashboardHistoryInvestment, Expense, Income, Invest } from '../../models/core.model';
import { ExpenseState, ExpenseStateModel } from '../expense/expense.state';




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
    balanceHistoryByMonth: DashboardHistoryBalance[],
    yearOptions: string[],
    filteredExpenseHistoryByMonth: DashboardHistoryExpense[],
    filteredIncomeHistoryByMonth: DashboardHistoryIncome[],
    filteredInvestHistoryByMonth: DashboardHistoryInvestment[],
    filteredBalanceHistoryByMonth: DashboardHistoryBalance[],
    monthExpenseDetail: Expense[],
    monthIncomeDetail: Income[],
    monthInvestmentsDetail: Invest[],
    monthBalancesDetail: BalanceSheetEntry[],
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
    balanceHistoryByMonth: [],
    yearOptions:[],
    filteredExpenseHistoryByMonth: [],
    filteredIncomeHistoryByMonth: [],
    filteredInvestHistoryByMonth: [],
    filteredBalanceHistoryByMonth: [],
    monthExpenseDetail: [],
    monthIncomeDetail: [],
    monthInvestmentsDetail: [],
    monthBalancesDetail: [],
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

  @Selector() 
  static yearOptions(state: DashboardStateModel): string[] {
    return state.yearOptions;
  };

  @Selector() 
  static filteredExpenseHistory(state: DashboardStateModel): DashboardHistoryExpense[] {
    return state.filteredExpenseHistoryByMonth;
  };

  @Selector() 
  static filteredIncomeHistory(state: DashboardStateModel): DashboardHistoryIncome[] {
    return state.filteredIncomeHistoryByMonth;
  };

  @Selector() 
  static filteredInvestHistory(state: DashboardStateModel): DashboardHistoryInvestment[] {
    return state.filteredInvestHistoryByMonth;
  };

  @Selector() 
  static filteredBalanceHistory(state: DashboardStateModel): DashboardHistoryBalance[] {
    return state.filteredBalanceHistoryByMonth;
  };

  @Action(DashboardActions.SetDashboardHistoryOnLogin)
  setDashboardHistoryOnLogin(
  ctx: StateContext<DashboardStateModel>,
  action: DashboardActions.SetDashboardHistoryOnLogin
  ) {

    console.log(action.payload);

    // get unique years for filter
    const yearOptions: string[] = Array.from(
      new Set(
        action.payload.balances.map((balance: DashboardHistoryBalance) => balance.unique_date.slice(0, 4))
      )
    );
    yearOptions.sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()));
    
    
    ctx.patchState({ 
      expenseHistoryByMonth: action.payload.expenses,
      incomeHistoryByMonth: action.payload.income,
      investHistoryByMonth: action.payload.investments,
      balanceHistoryByMonth: action.payload.balances,
      yearOptions: yearOptions,
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

  

  @Action(DashboardActions.SetDashboardAnnualFilter)
  setDashboardAnnualFilter(
    ctx: StateContext<DashboardStateModel>,
    action: DashboardActions.SetDashboardAnnualFilter
  ) {
    /**
     *  For test data that will probably have transactions in the future to front-run demo and updating db.
     *  Will curtail data to this month, not restricting to this day of the month because somethings like
     *  recurring payments will hopefully be auto-generated in post 1.0 versions
     */
    const today: Date = new Date();
    const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];
    const todayFullYear: string = today.getFullYear().toString();
    const todayShortMonth: string = today.toLocaleDateString('en-US', { month: 'short' });
    let month: string = (months.findIndex((month: string) => month === todayShortMonth) + 1).toString();
    if (month.length === 1) { month = '0' + month};
    
    const year: string = action.payload.toString();
    const expenseHistory: DashboardHistoryExpense[] = ctx.getState().expenseHistoryByMonth;
    const incomeHistory: DashboardHistoryIncome[] = ctx.getState().incomeHistoryByMonth;
    const investHistory: DashboardHistoryInvestment[] = ctx.getState().investHistoryByMonth;
    const balanceHistory: DashboardHistoryBalance[] = ctx.getState().balanceHistoryByMonth;

    const filteredExpenseHistory: DashboardHistoryExpense[] = expenseHistory.filter((expense: DashboardHistoryExpense) => year === todayFullYear ? expense.unique_date.slice(0, 4) === year && <number><unknown>expense.unique_date.slice(5,8) <= <number><unknown>month : expense.unique_date.slice(0, 4) === year);
    const filteredIncomeHistory: DashboardHistoryIncome[] = incomeHistory.filter((income: DashboardHistoryIncome) => year === todayFullYear ? income.unique_date.slice(0,4) === year && <number><unknown>income.unique_date.slice(5,8) <= <number><unknown>month : income.unique_date.slice(0,4) === year);
    const filtreredInvestHistory: DashboardHistoryInvestment[] = investHistory.filter((invest: DashboardHistoryInvestment) => year === todayFullYear ? invest.unique_date.slice(0,4) === year && <number><unknown>invest.unique_date.slice(5,8) <= <number><unknown>month : invest.unique_date.slice(0,4) === year);
    const filtreredBalanceHistory: DashboardHistoryBalance[] = balanceHistory.filter((balance: DashboardHistoryBalance) => year === todayFullYear ? balance.unique_date.slice(0,4) === year && <number><unknown>balance.unique_date.slice(5,8) <= <number><unknown>month : balance.unique_date.slice(0,4) === year);
    
    ctx.patchState({ 
      filteredExpenseHistoryByMonth: filteredExpenseHistory,
      filteredIncomeHistoryByMonth: filteredIncomeHistory,
      filteredInvestHistoryByMonth: filtreredInvestHistory,
      filteredBalanceHistoryByMonth: filtreredBalanceHistory,
    });
  };

  @Action(DashboardActions.SetDashboardMonthFilter)
  setDashboardMonthFilter(
  ) {
    console.log(' Not sure really need this anymore!');
  };

  @Action(DashboardActions.SetMonthExpensesForDashboard)
  setMonthExpensesForDashboard(
    ctx: StateContext<DashboardStateModel>,
    action: DashboardActions.SetMonthExpensesForDashboard
  ) {
    ctx.patchState({ 
      monthExpenseDetail: action.payload,
    });
  };

  @Action(DashboardActions.SetMonthIncomeForDashboard)
  setMonthIncomeForDashboard(
    ctx: StateContext<DashboardStateModel>,
    action: DashboardActions.SetMonthIncomeForDashboard
  ) {
    ctx.patchState({ 
      monthIncomeDetail: action.payload,
    });
  };

  @Action(DashboardActions.SetMonthInvestmentsForDashboard)
  setMonthInvestmentsForDashboard(
    ctx: StateContext<DashboardStateModel>,
    action: DashboardActions.SetMonthInvestmentsForDashboard
  ) {
    ctx.patchState({ 
      monthInvestmentsDetail: action.payload,
    });
  };

  @Action(DashboardActions.SetMonthBalancesForDashboard)
  setMonthBalancesForDashboard(
    ctx: StateContext<DashboardStateModel>,
    action: DashboardActions.SetMonthBalancesForDashboard
  ) {
    ctx.patchState({ 
      monthBalancesDetail: action.payload,
    });
  };

  @Action(DashboardActions.SetDashboardAllTimeFilter)
  setDashboardAllTimeFilter(
    ctx: StateContext<DashboardStateModel>,
  ) {    
    console.log('Dashboard state all-time filter')

    /**
     *  For test data that will probably have transactions in the future to front-run demo and updating db.
     *  Will curtail data to this month, not restricting to this day of the month because somethings like
     *  recurring payments will hopefully be auto-generated in post 1.0 versions
     */
    const today: Date = new Date();
    const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];
    const todayFullYear: string = today.getFullYear().toString();
    const todayShortMonth: string = today.toLocaleDateString('en-US', { month: 'short' });
    let month: string = (months.findIndex((month: string) => month === todayShortMonth) + 1).toString();
    if (month.length === 1) { month = '0' + month};
    
    const expenseHistory: DashboardHistoryExpense[] = ctx.getState().expenseHistoryByMonth;
    const incomeHistory: DashboardHistoryIncome[] = ctx.getState().incomeHistoryByMonth;
    const investHistory: DashboardHistoryInvestment[] = ctx.getState().investHistoryByMonth;
    const balanceHistory: DashboardHistoryBalance[] = ctx.getState().balanceHistoryByMonth;

    const filteredExpenseHistory: DashboardHistoryExpense[] = expenseHistory.filter((expense: DashboardHistoryExpense) => expense.unique_date.slice(0, 4) === todayFullYear ? expense.unique_date.slice(0, 4) === todayFullYear && <number><unknown>expense.unique_date.slice(5,8) <= <number><unknown>month : true );
    const filteredIncomeHistory: DashboardHistoryIncome[] = incomeHistory.filter((income: DashboardHistoryIncome) => income.unique_date.slice(0,4) === todayFullYear ? income.unique_date.slice(0,4) === todayFullYear && <number><unknown>income.unique_date.slice(5,8) <= <number><unknown>month : true );
    const filtreredInvestHistory: DashboardHistoryInvestment[] = investHistory.filter((invest: DashboardHistoryInvestment) => invest.unique_date.slice(0,4) === todayFullYear ? invest.unique_date.slice(0,4) === todayFullYear && <number><unknown>invest.unique_date.slice(5,8) <= <number><unknown>month : true );
    const filtreredBalanceHistory: DashboardHistoryBalance[] = balanceHistory.filter((balance: DashboardHistoryBalance) => balance.unique_date.slice(0,4) === todayFullYear ? balance.unique_date.slice(0,4) === todayFullYear && <number><unknown>balance.unique_date.slice(5,8) <= <number><unknown>month : true );

    ctx.patchState({ 
      filteredExpenseHistoryByMonth: filteredExpenseHistory,
      filteredIncomeHistoryByMonth: filteredIncomeHistory,
      filteredInvestHistoryByMonth: filtreredInvestHistory,
      filteredBalanceHistoryByMonth: filtreredBalanceHistory,
    });

  };

}