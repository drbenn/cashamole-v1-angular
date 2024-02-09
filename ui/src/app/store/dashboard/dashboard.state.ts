import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DashboardActions } from './dashboard.actions';
import { 
  BalanceSheetEntry,
  DashboardHistoryBalance,
  DashboardHistoryCashFlow,
  DashboardHistoryExpense,
  DashboardHistoryIncome,
  DashboardHistoryInvestment,
  DashboardHistoryNetWorth,
  Expense,
  Income,
  Invest
} from '../../models/core.model';


export interface DashboardStateModel {
    // required for transaction screen dashboard summaries 
    monthExpenses: number,
    monthIncome: number,
    monthInvest: number,
    monthPreTaxInvest: number,
    monthPostTaxInvest: number,
    monthNetCashFlow: number,
    monthAssets: number,
    monthLiabilities: number,
    monthNetWorth: number,

    // required for dashboard
    yearOptions: string[],
    yearMonthOptions: string[],
    activeAnnualYear: string,
    activeMonthlyYear: string,
    activeMonthlyMonth: string,
    userSelectedView: 'monthly' | 'annual' | 'all-time' | 'y-t-d',
    expenseHistoryByMonth: DashboardHistoryExpense[],
    incomeHistoryByMonth: DashboardHistoryIncome[],
    investHistoryByMonth: DashboardHistoryInvestment[],
    balanceHistoryByMonth: DashboardHistoryBalance[],
    activeViewExpenses: DashboardHistoryExpense[],
    activeViewIncome: DashboardHistoryIncome[],
    activeViewInvestments: DashboardHistoryInvestment[],
    activeViewAssets: DashboardHistoryBalance[],
    activeViewLiabilities: DashboardHistoryBalance[],
    activeViewNetWorth: any[]
}

@State<DashboardStateModel>({
  name: 'dashboard',
  defaults: {
    // required for transaction screen dashboard summaries 
    monthExpenses: 0,
    monthIncome: 0,
    monthInvest: 0,
    monthPreTaxInvest: 0,
    monthPostTaxInvest: 0,
    monthNetCashFlow: 0,
    monthAssets: 0,
    monthLiabilities: 0,
    monthNetWorth: 0,

    // required for dashboard
    yearOptions:[],
    yearMonthOptions: [],
    activeAnnualYear: '',
    activeMonthlyYear: '',
    activeMonthlyMonth: '',
    userSelectedView: 'all-time',
    expenseHistoryByMonth: [],
    incomeHistoryByMonth: [],
    investHistoryByMonth: [],
    balanceHistoryByMonth: [],
    activeViewExpenses: [],
    activeViewIncome: [],
    activeViewInvestments: [],
    activeViewAssets: [],
    activeViewLiabilities: [],
    activeViewNetWorth: []
    },
  }
)
@Injectable()
export class DashboardState {

  constructor() {}

  @Selector() 
  static yearOptions(state: DashboardStateModel): string[] {
    return state.yearOptions;
  };

  @Selector() 
  static monthCashFlowSummary(state: DashboardStateModel): any {
    return {
      monthIncome: state.monthIncome,
      monthExpenses: state.monthExpenses,
      monthNetCashFlow: state.monthNetCashFlow 
    };
  };

  @Selector() 
  static monthCashInvestedSummary(state: DashboardStateModel): any {
    return {
      monthIncome: state.monthIncome,
      monthPreTaxInvest: state.monthPreTaxInvest,
      monthPostTaxInvest: state.monthPostTaxInvest,
      monthInvest: state.monthInvest
    };
  };

  @Selector() 
  static monthNetWorthSummary(state: DashboardStateModel): any {
    return {
      monthAssets: state.monthAssets,
      monthLiabilities: state.monthLiabilities,
      monthNetWorth: state.monthNetWorth
    };
  };


  @Selector() 
  static activeYearMonthOptions(state: DashboardStateModel): string[] {
    const monthlabelOptions: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsUsedInActiveYearSet: Set<any> = state.balanceHistoryByMonth
      .filter((balance: DashboardHistoryBalance) => balance.type === 'asset' && balance.unique_date.slice(0, 4) === state.activeAnnualYear)
      .map((balance: DashboardHistoryBalance) => {
        return { month: balance.unique_date.slice(5, 7)}
      })
      .reduce((uniqueSet, obj) => {
        uniqueSet.add(obj.month);
        return uniqueSet;
      }, new Set());
      
      // TODO: If active year ensure only up to current month is available
      let monthsUsedInActiveYearArray: string[] = Array.from(monthsUsedInActiveYearSet);
      const today = new Date();
      const todayMonth: string = today.toLocaleDateString('en-US', { month: '2-digit' });
      const todayFullYear: string = today.getFullYear().toString();
      if (state.activeAnnualYear === todayFullYear) {
        const shortenedMonthsUsedInActiveYearArray: string[] = [];
        monthsUsedInActiveYearArray.forEach((month: string) => parseInt(month) <= parseInt(todayMonth) ? shortenedMonthsUsedInActiveYearArray.push(month): null);
        monthsUsedInActiveYearArray = shortenedMonthsUsedInActiveYearArray; 
      };
      const activeYearMonthOptions: string[] = [];
      monthsUsedInActiveYearArray.forEach((monthNum: string) => activeYearMonthOptions.push(monthlabelOptions[parseInt(monthNum) - 1]));

    return activeYearMonthOptions;  
  };

  @Selector() 
  static selectedDashboardView(state: DashboardStateModel): string {
    return state.userSelectedView;
  };

  @Selector() 
  static expenseCompositionChartData(state: DashboardStateModel): { userView: string, data: DashboardHistoryExpense[] } {
    return {
      userView: state.userSelectedView,
      data: state.activeViewExpenses
    };
  };

  @Selector() 
  static investCompositionChartData(state: DashboardStateModel): { userView: string, data: DashboardHistoryInvestment[] } {
    return {
      userView: state.userSelectedView,
      data: state.activeViewInvestments
    };
  };

  @Selector() 
  static assetCompositionChartData(state: DashboardStateModel): { userView: string, data: DashboardHistoryBalance[] } {
    return {
      userView: state.userSelectedView,
      data: state.activeViewAssets
    };
  };

  @Selector() 
  static liabilityCompositionChartData(state: DashboardStateModel): { userView: string, data: DashboardHistoryBalance[] } {
    return {
      userView: state.userSelectedView,
      data: state.activeViewLiabilities
    };
  };

  @Selector() 
  static incomeHistoryChartData(state: DashboardStateModel): { userView: string, data: DashboardHistoryIncome[] } {    
    return {
      userView: state.userSelectedView,
      data: state.activeViewIncome
    };
  };

  @Selector() 
  static expenseHistoryChartData(state: DashboardStateModel): { userView: string, data: DashboardHistoryExpense[] } {
    return {
      userView: state.userSelectedView,
      data: state.activeViewExpenses
    };
  };

  @Selector() 
  static netWorthHistoryChartData(state: DashboardStateModel): { userView: string, data: DashboardHistoryNetWorth[] } {
    return {
      userView: state.userSelectedView,
      data: state.activeViewNetWorth
    };
  };

  @Selector() 
  static assetVsLiabilityHistoryChartData(state: DashboardStateModel): { userView: string, assetData: DashboardHistoryBalance[], liabilityData: DashboardHistoryBalance[] } {
    return {
      userView: state.userSelectedView,
      assetData: state.activeViewAssets,
      liabilityData: state.activeViewLiabilities
    };
  };

  @Selector() 
  static netCashFlowChartData(state: DashboardStateModel): { userView: string, data: DashboardHistoryCashFlow[] } {
    const income: DashboardHistoryIncome[] = state.activeViewIncome;
    const expenses: DashboardHistoryExpense[] = state.activeViewExpenses;
    const uniqueDates: string[] = Array.from(
      new Set(
        expenses.map((item: DashboardHistoryExpense) => item.unique_date)
    ));
    uniqueDates.sort();

    const xYearMonthDataDate: string[] = new Array(uniqueDates.length).fill('');
    const xYearMonthDataAmount: number[] = new Array(uniqueDates.length).fill(0);
    uniqueDates.forEach((item: string, index: number ) => {
      xYearMonthDataDate[index] = item
    });
    income.forEach((income: DashboardHistoryIncome) => {
      const index: number = xYearMonthDataDate.findIndex((date: string) => date === income.unique_date);
      if (index > -1) {xYearMonthDataAmount[index] += parseFloat(income.total_income)};
    });
    expenses.forEach((expense: DashboardHistoryExpense) => {
      const index: number = xYearMonthDataDate.findIndex((date: string) => date === expense.unique_date);
      if (index > -1) {xYearMonthDataAmount[index] -= parseFloat(expense.total_expense)};
    });

    const cashFlowArray: DashboardHistoryCashFlow[] = [];
    xYearMonthDataDate.forEach((date: string, index: number) => {
      cashFlowArray.push({ unique_date: date , cash_flow: xYearMonthDataAmount[index].toString() });
    });
    return {
      userView: state.userSelectedView,
      data: cashFlowArray,
    };
  };

  @Action(DashboardActions.SetDashboardHistoryOnLogin)
  setDashboardHistoryOnLogin(
  ctx: StateContext<DashboardStateModel>,
  action: DashboardActions.SetDashboardHistoryOnLogin
  ) {
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

  /////////////////////////////////////////////////////////////////////
  //
  //
  //      Actions For Updating Summaries in Input Pages
  //
  //
  /////////////////////////////////////////////////////////////////////


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





  /////////////////////////////////////////////////////////////////////
  //
  //
  //      Actions For Chart Dashboard Data
  //
  //
  /////////////////////////////////////////////////////////////////////
  @Action(DashboardActions.SetActiveAnnualYearForDashboard)
  setActiveAnnualYearForDashboard(
    ctx: StateContext<DashboardStateModel>,
    action: DashboardActions.SetActiveAnnualYearForDashboard
  ) {
    ctx.patchState({ 
      activeAnnualYear: action.payload,
    });
  };

  @Action(DashboardActions.SetActiveMonthlyYearForDashboard)
  setActiveMonthlyYearForDashboard(
    ctx: StateContext<DashboardStateModel>,
    action: DashboardActions.SetActiveMonthlyYearForDashboard
  ) {
    ctx.patchState({ 
      activeMonthlyYear: action.payload,
    });
  };

  @Action(DashboardActions.SetActiveMonthlyMonthForDashboard)
  setActiveMonthlyMonthForDashboard(
    ctx: StateContext<DashboardStateModel>,
    action: DashboardActions.SetActiveMonthlyMonthForDashboard
  ) {
    ctx.patchState({ 
      activeMonthlyMonth: action.payload,
    });
  };

  @Action(DashboardActions.FilterDataForSelectedTimePeriodView)
  filterDataForSelectedTimePeriodView(
    ctx: StateContext<DashboardStateModel>,
    action: DashboardActions.FilterDataForSelectedTimePeriodView
  ) {
    // console.log(action.payload);
    // limit data to nothing after the current month of today
    const today: Date = new Date();
    const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];
    const monthStrings: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const todayFullYear: string = today.getFullYear().toString();
    const todayShortMonth: string = today.toLocaleDateString('en-US', { month: 'short' });
    const currentMonthIndex: number = (months.findIndex((month: string) => month === todayShortMonth));
    const currentYearLimitedMonths: string[] = months.slice(0,currentMonthIndex + 1);
    const currentYearLimitedMonthsDigits: string[] = [];
    currentYearLimitedMonths.forEach((_month: string) => {
      const matchingMonth: string = monthStrings[(months.findIndex((month: string) => month === _month))];
      currentYearLimitedMonthsDigits.push(matchingMonth);
    });

    // Find year/month for use in filters
    const activeView: 'monthly' | 'annual' | 'all-time' | 'y-t-d' | null = action.payload.type;
    const activeMonth: string = action.payload.month === null ? '' : action.payload.month.toString();
    let activeYear: string = '';
    if (action.payload.type === 'y-t-d' || action.payload.year === null) {
      const yearOptions: string[] = ctx.getState().yearOptions;
      activeYear = yearOptions[yearOptions.length - 1];
    } else if (
        action.payload.type === 'monthly' && action.payload.year !== null ||
        action.payload.type === 'annual' && action.payload.year !== null
        ) {
      activeYear = action.payload.year.toString();
    };    

    // All values for base filters
    const expenseHistory: DashboardHistoryExpense[] = ctx.getState().expenseHistoryByMonth;
    const incomeHistory: DashboardHistoryIncome[] = ctx.getState().incomeHistoryByMonth;
    const investHistory: DashboardHistoryInvestment[] = ctx.getState().investHistoryByMonth;
    const balanceHistory: DashboardHistoryBalance[] = ctx.getState().balanceHistoryByMonth;
    
    if (activeView === 'all-time') {
      const allTimeExpenses: DashboardHistoryExpense[] = expenseHistory.filter((item: DashboardHistoryExpense) => {
        return this.allTimeValidationFilter(todayFullYear, currentYearLimitedMonthsDigits, item);
      });
      const allTimeIncome: DashboardHistoryIncome[] = incomeHistory.filter((item: DashboardHistoryIncome) => {
        return this.allTimeValidationFilter(todayFullYear, currentYearLimitedMonthsDigits, item);
      });
      const allTimeInvest: DashboardHistoryInvestment[] = investHistory.filter((item: DashboardHistoryInvestment) => {
        return this.allTimeValidationFilter(todayFullYear, currentYearLimitedMonthsDigits, item);
      });
      const allTimeAssets: DashboardHistoryBalance[] = balanceHistory.filter((item: DashboardHistoryBalance) => {
        return this.allTimeValidationFilter(todayFullYear, currentYearLimitedMonthsDigits, item);
      }).filter((_item: DashboardHistoryBalance) => _item.type === 'asset');
      const allTimeLiabilies: DashboardHistoryBalance[] = balanceHistory.filter((item: DashboardHistoryBalance) => {
        return this.allTimeValidationFilter(todayFullYear, currentYearLimitedMonthsDigits, item);
      }).filter((_item: DashboardHistoryBalance) => _item.type === 'liability');
      const allTimeNetWorth: DashboardHistoryNetWorth[] = this.generateAllTimeNetWorthData(allTimeAssets,allTimeLiabilies);
      
      ctx.patchState({
        userSelectedView: 'all-time',
        activeViewExpenses: allTimeExpenses,
        activeViewIncome: allTimeIncome,
        activeViewInvestments: allTimeInvest,
        activeViewAssets: allTimeAssets,
        activeViewLiabilities: allTimeLiabilies,
        activeViewNetWorth: allTimeNetWorth
      });
    };

    // activeView annual is also called and accounts for Y-T-D view selection
    if (activeView === 'annual' || activeView === 'y-t-d') {

      activeView === 'y-t-d' ? activeYear = todayFullYear : activeYear = activeYear;

      const annualExpenses: DashboardHistoryExpense[] = expenseHistory.filter((item: DashboardHistoryExpense) => {
        return this.annualYearValidationFilter(activeYear, todayFullYear, currentYearLimitedMonthsDigits, item);
      });
      const annualIncome: DashboardHistoryIncome[] = incomeHistory.filter((item: DashboardHistoryIncome) => {
        return this.annualYearValidationFilter(activeYear, todayFullYear, currentYearLimitedMonthsDigits, item);
      });
      const annualInvest: DashboardHistoryInvestment[] = investHistory.filter((item: DashboardHistoryInvestment) => {
        return this.annualYearValidationFilter(activeYear, todayFullYear, currentYearLimitedMonthsDigits, item);
      });
      const annualAssets: DashboardHistoryBalance[] = balanceHistory.filter((item: DashboardHistoryBalance) => {
        return this.annualYearValidationFilter(activeYear, todayFullYear, currentYearLimitedMonthsDigits, item);
      }).filter((_item: DashboardHistoryBalance) => _item.type === 'asset');
      const annualLiabilies: DashboardHistoryBalance[] = balanceHistory.filter((item: DashboardHistoryBalance) => {
        return this.annualYearValidationFilter(activeYear, todayFullYear, currentYearLimitedMonthsDigits, item);
      }).filter((_item: DashboardHistoryBalance) => _item.type === 'liability');
      const annualNetWorth: DashboardHistoryNetWorth[] = this.generateOneYearNetWorthData(annualAssets,annualLiabilies);
      
      ctx.patchState({
        userSelectedView: 'annual',
        activeViewExpenses: annualExpenses,
        activeViewIncome: annualIncome,
        activeViewInvestments: annualInvest,
        activeViewAssets: annualAssets,
        activeViewLiabilities: annualLiabilies,
        activeViewNetWorth: annualNetWorth
      });
    };

    if (activeView === 'monthly') {      
      const monthlyExpenses: DashboardHistoryExpense[] = expenseHistory.filter((item: DashboardHistoryExpense) => {
        return this.monthlyValidationFilter(activeMonth, activeYear, item);
      });
      const monthlyIncome: DashboardHistoryIncome[] = incomeHistory.filter((item: DashboardHistoryIncome) => {
        return this.monthlyValidationFilter(activeMonth, activeYear, item);
      });
      const monthlyInvest: DashboardHistoryInvestment[] = investHistory.filter((item: DashboardHistoryInvestment) => {
        return this.monthlyValidationFilter(activeMonth, activeYear, item);
      });
      const monthlyAssets: DashboardHistoryBalance[] = balanceHistory.filter((item: DashboardHistoryBalance) => {
        return this.monthlyValidationFilter(activeMonth, activeYear, item);
      }).filter((_item: DashboardHistoryBalance) => _item.type === 'asset');
      const monthlyLiabilities: DashboardHistoryBalance[] = balanceHistory.filter((item: DashboardHistoryBalance) => {
        return this.monthlyValidationFilter(activeMonth, activeYear, item);
      }).filter((_item: DashboardHistoryBalance) => _item.type === 'liability');
      const monthlyNetWorth: DashboardHistoryNetWorth[] = this.generateMonthlyNetWorthData(monthlyAssets,monthlyLiabilities);
      
      ctx.patchState({
        userSelectedView: 'monthly',
        activeViewExpenses: monthlyExpenses,
        activeViewIncome: monthlyIncome,
        activeViewInvestments: monthlyInvest,
        activeViewAssets: monthlyAssets,
        activeViewLiabilities: monthlyLiabilities,
        activeViewNetWorth: monthlyNetWorth
      });
    };
  };


  private allTimeValidationFilter(
    todayFullYear: string,
    currentYearLimitedMonthsDigits: string[],
    item: DashboardHistoryExpense | DashboardHistoryIncome | DashboardHistoryInvestment | DashboardHistoryBalance
    ): boolean {
    const itemYear: string = item.unique_date.slice(0, 4);
    const itemMonth: string = item.unique_date.slice(5,8);
    const isItemCurrentYear: boolean = itemYear === todayFullYear;
    const isMonthInCurrentYearLimitedMonths: boolean = currentYearLimitedMonthsDigits.includes(itemMonth);
    return !isItemCurrentYear || isItemCurrentYear && isMonthInCurrentYearLimitedMonths;
  };

  private annualYearValidationFilter(
    activeYear: string,
    todayFullYear: string,
    currentYearLimitedMonthsDigits: string[],
    item: DashboardHistoryExpense | DashboardHistoryIncome | DashboardHistoryInvestment | DashboardHistoryBalance
    ): boolean {
    const itemYear: string = item.unique_date.slice(0, 4);
    const itemMonth: string = item.unique_date.slice(5,8);
    const isSelectedYearCurrentYear: boolean = activeYear === todayFullYear;
    const isItemActiveYear: boolean = itemYear === activeYear;
    const isMonthInCurrentYearLimitedMonths: boolean = currentYearLimitedMonthsDigits.includes(itemMonth);
    if (!isSelectedYearCurrentYear) {
      return itemYear === activeYear;
    } else {
      return isItemActiveYear && isMonthInCurrentYearLimitedMonths
    };
  };

  /**
   * 
   * @param activeMonth 'Jan' or 'Feb' etc...
   * @param activeYear '2022' or '2023' etc...
   * @param item 
   * @returns 
   */
  private monthlyValidationFilter(
    activeMonth: string,
    activeYear: string,
    item: DashboardHistoryExpense | DashboardHistoryIncome | DashboardHistoryInvestment | DashboardHistoryBalance | any
    ): boolean {
    const itemYear: string = item.unique_date.slice(0, 4);
    const itemMonth: string = item.unique_date.slice(5,8);
    const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const itemMonthAsShortMonth: string = months[parseInt(itemMonth) - 1];    
    return itemYear == activeYear && itemMonthAsShortMonth == activeMonth;
  };

  /**
   * Chart data to display progress for single month, One data object in array
   * @param annualAssets 
   * @param annualLiabilities 
   * @returns DashboardHistoryNetWorth[]
   */
  private generateMonthlyNetWorthData(
    monthlyAssets: DashboardHistoryBalance[],
    monthlyLiabilities: DashboardHistoryBalance[]
    ): DashboardHistoryNetWorth[] {
    let netWorthTotal: number = 0;
    let monthNetWorth: DashboardHistoryNetWorth = {
      unique_date: '',
      net_worth: ''
    };
    monthlyAssets.forEach((item: DashboardHistoryBalance) => netWorthTotal += parseFloat(item.total_balance));
    monthlyLiabilities.forEach((item: DashboardHistoryBalance) => netWorthTotal -= parseFloat(item.total_balance));
    monthNetWorth.unique_date = monthlyAssets[0].unique_date;
    monthNetWorth.net_worth = netWorthTotal.toString();

    const netWorth: DashboardHistoryNetWorth[] = [monthNetWorth];
    return netWorth;
  };

  /**
   * Chart data to display progress by Month for selected year
   * @param annualAssets 
   * @param annualLiabilities 
   * @returns DashboardHistoryNetWorth[]
   */
  private generateOneYearNetWorthData(
    annualAssets: DashboardHistoryBalance[],
    annualLiabilities: DashboardHistoryBalance[]
    ): DashboardHistoryNetWorth[] {
    const netWorthArray: DashboardHistoryNetWorth[] = [];
    // find/list available months for year
    const uniqueDates: string[] = Array.from(
      new Set(
        annualAssets.map((item: DashboardHistoryBalance) => item.unique_date)
    ));
    uniqueDates.sort();
    const xYearMonthData: number[] = new Array(uniqueDates.length).fill(0);

    annualAssets.forEach((item: DashboardHistoryBalance) => {
      const indexFromAvailableMonths: number = uniqueDates.findIndex((year_month: string) => item.unique_date === year_month);
      xYearMonthData[indexFromAvailableMonths] += parseFloat(item.total_balance);
    });
    annualLiabilities.forEach((item: DashboardHistoryBalance) => {
      const indexFromAvailableMonths: number = uniqueDates.findIndex((year_month: string) => item.unique_date === year_month);
      xYearMonthData[indexFromAvailableMonths] -= parseFloat(item.total_balance);
    });

    uniqueDates.forEach((uniqueDate: string, index: number) => {
      let monthNetWorth: DashboardHistoryNetWorth = {
        unique_date: uniqueDate,
        net_worth: xYearMonthData[index].toString()
      };
      netWorthArray.push(monthNetWorth);
    });
    return netWorthArray;
  };

  /**
   * Chart data to display progress by year
   * - each year designated by start date of year Jan 1, balance sheet data
   * - start and end dates are based on user data, to expand from when user first started to input data, until the current month
   * @param annualAssets 
   * @param annualLiabilities 
   * @returns DashboardHistoryNetWorth[]
   */
  private generateAllTimeNetWorthData(
    annualAssets: DashboardHistoryBalance[],
    annualLiabilities: DashboardHistoryBalance[]
    ): DashboardHistoryNetWorth[] {
    // 1. Take all asset/liability data and calculate networth for each month
    const allNetWorthByMonthAndYear: DashboardHistoryNetWorth[] =  this.generateOneYearNetWorthData(annualAssets, annualLiabilities);
    // 2. Find Unique Years from data range
    const uniqueYears: string[] = Array.from(
      new Set(
        allNetWorthByMonthAndYear.map((item: DashboardHistoryNetWorth) => item.unique_date.slice(0, 4))
    ));
    uniqueYears.sort();
    // 3. Find first month instance of unique year(hopefully all Jan_20XX)
    const labelDates: string[] = [];
    uniqueYears.forEach((year: string) => {
      let firstMonthoOfUniqueYear = allNetWorthByMonthAndYear.find((item: DashboardHistoryNetWorth) => item.unique_date.slice(0, 4) === year);
      if (firstMonthoOfUniqueYear) {
        labelDates.push(firstMonthoOfUniqueYear.unique_date)
      };
    })
    // 4. Add start/end dates to data (if user started recording data before Jan of first year, and up to current date)
    if (allNetWorthByMonthAndYear.length && allNetWorthByMonthAndYear[0].unique_date && labelDates[0] !== allNetWorthByMonthAndYear[0].unique_date) {
      labelDates.unshift(allNetWorthByMonthAndYear[0].unique_date)
    };
    if (allNetWorthByMonthAndYear.length && allNetWorthByMonthAndYear[0].unique_date && labelDates[labelDates.length - 1] !== allNetWorthByMonthAndYear[allNetWorthByMonthAndYear.length - 1].unique_date) {
      labelDates.push(allNetWorthByMonthAndYear[allNetWorthByMonthAndYear.length - 1].unique_date);
    };
    // 5. Create array of net worth data from only specific unique_date labelDates for displaying chart data at appropriate intervals
    const allTimeIntervaledNetWorthData: DashboardHistoryNetWorth[] = [];
    labelDates.forEach((date: string) => {
      const netWorthAtInterval = allNetWorthByMonthAndYear.find((item: DashboardHistoryNetWorth) => item.unique_date === date);
      if (netWorthAtInterval) {
        allTimeIntervaledNetWorthData.push(netWorthAtInterval);
      };
    });

    return allTimeIntervaledNetWorthData;
  };
}

