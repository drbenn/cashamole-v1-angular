import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { CalendarActions } from './calendar.actions';
import { DateRange } from '../../models/calendar.model';
import { BalanceSheetActions } from '../balanceSheet/bsState.actions';
import { IncomeActions } from '../income/income.actions';
import { ExpenseActions } from '../expense/expense.actions';
import { InvestActions } from '../invest/invest.actions';
import { CoreApiService } from '../../api-services/core-api.service';
import { first, take } from 'rxjs';
import { MonthRecordsResponse } from '../../models/core.model';
import { Month } from 'primeng/calendar';
import { DashboardActions } from '../dashboard/dashboard.actions';


export interface CalendarStateModel {
    monthYearDisplay: any,
    monthDisplayShortName: string,
    monthDisplayLongName: string,
    monthDateRange: DateRange,
    earliestTransactionDate: Date,
}

@State<CalendarStateModel>({
  name: 'calendar',
  defaults: {
      monthYearDisplay: '',
      monthDisplayShortName: '',
      monthDisplayLongName: '',
      monthDateRange: {
        startDate: new Date(),
        endDate: new Date()
      }, 
      earliestTransactionDate: new Date(),
    },
  }
)
@Injectable()
export class CalendarState {
  constructor(
    private store: Store,
    private coreApi: CoreApiService
  ) {}

  @Selector() 
  static activeMonthStartDate(state: CalendarStateModel): Date {
    return state.monthDateRange.startDate;
  };

  @Selector() 
  static activeMonthDateRange(state: CalendarStateModel): DateRange {
    return state.monthDateRange;
  };


  @Action(CalendarActions.SetCalendarOnLogin)
  setCalendarOnLogin(
    ctx: StateContext<CalendarStateModel>
  ) {
    const now: Date = new Date();
    const firstDayOfCurrentMonth: Date = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfCurrentMonth: Date = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const shortMonthName = now.toLocaleString('en-US', { month: 'short' });
    const longMonthName = now.toLocaleString('en-US', { month: 'long' });
    const monthYear = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const year: string = firstDayOfCurrentMonth.getFullYear().toString();
    const month: string = (firstDayOfCurrentMonth.getMonth() + 1).toString().padStart(2, '0');
    const yearMonthId: string = `${year}-${month}`;
    this.store.dispatch(new CalendarActions.GetAllRecordsForMonth(yearMonthId));

    ctx.patchState({ 
        monthYearDisplay: monthYear,
        monthDisplayShortName: shortMonthName,
        monthDisplayLongName: longMonthName,
        monthDateRange: {
            startDate: firstDayOfCurrentMonth,
            endDate: lastDayOfCurrentMonth
        }
    });
  }

  @Action(CalendarActions.ChangeCalendarMonth)
  changeCalendarMonth(
    ctx: StateContext<CalendarStateModel>,
    action: CalendarActions.ChangeCalendarMonth
  ) {
    const shortMonthName = action.payload.startDate.toLocaleString('en-US', { month: 'short' });
    const longMonthName = action.payload.startDate.toLocaleString('en-US', { month: 'long' });
    const monthYear = action.payload.startDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const year: string = action.payload.startDate.getFullYear().toString();
    const month: string = (action.payload.startDate.getMonth() + 1).toString().padStart(2, '0');
    const yearMonthId: string = `${year}-${month}`;
    this.store.dispatch(new CalendarActions.GetAllRecordsForMonth(yearMonthId));

    ctx.patchState({
      monthYearDisplay: monthYear,
      monthDisplayShortName: shortMonthName,
      monthDisplayLongName: longMonthName,
      monthDateRange: {startDate: action.payload.startDate, endDate: action.payload.endDate} 
    });
  };

  @Action(CalendarActions.GetAllRecordsForMonth)
  getAllRecordsForMonth(
    ctx: StateContext<CalendarStateModel>,
    action: CalendarActions.GetAllRecordsForMonth
  ) {
    this.coreApi.getActiveMonthRecords(action.yearMonthId).pipe(take(1), first())
    .subscribe(
      {
        next: (response: any) => {         
          const responseParsed: any = JSON.parse(response.data);
          const monthRecordsResponse: MonthRecordsResponse = {
            balanceSheetRecords: responseParsed.balanceSheetRecords,
            expenseRecords: responseParsed.expenseRecords,
            incomeRecords: responseParsed.incomeRecords,
            investRecords: responseParsed.investRecords
          };

          this.store.dispatch(new CalendarActions.SetAllRecordsForMonth(monthRecordsResponse));
        },
        error: (error: any) => {
          console.error(error);
        }
      }
    )
  };

  @Action(CalendarActions.SetAllRecordsForMonth)
  setAllRecordsForMonth(
    ctx: StateContext<CalendarStateModel>,
    action: CalendarActions.SetAllRecordsForMonth
  ) {
      // set records for itemized transaction/table display and use
      this.store.dispatch(new BalanceSheetActions.SetMonthBalanceRecords(action.monthRecords.balanceSheetRecords));
      this.store.dispatch(new IncomeActions.SetMonthIncomeRecords(action.monthRecords.incomeRecords));
      this.store.dispatch(new ExpenseActions.SetMonthExpenseRecords(action.monthRecords.expenseRecords));
      this.store.dispatch(new InvestActions.SetMonthInvestRecords(action.monthRecords.investRecords));
      
      // send records for use in calculating dashboard summary values
      this.store.dispatch(new DashboardActions.UpdateMonthBalanceSheetTotal(action.monthRecords.balanceSheetRecords));
      this.store.dispatch(new DashboardActions.UpdateMonthIncomeTotal(action.monthRecords.incomeRecords));
      this.store.dispatch(new DashboardActions.UpdateMonthExpenseTotal(action.monthRecords.expenseRecords));
      this.store.dispatch(new DashboardActions.UpdateMonthInvestTotal(action.monthRecords.investRecords));
  };

}