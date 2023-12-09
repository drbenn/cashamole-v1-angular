import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { CalendarActions } from './calendar.actions';
import { DateRange } from '../../model/calendar.model';


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
    private store: Store
  ) {}


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

    ctx.patchState({
      monthYearDisplay: monthYear,
      monthDisplayShortName: shortMonthName,
      monthDisplayLongName: longMonthName,
      monthDateRange: {startDate: action.payload.startDate, endDate: action.payload.endDate} 
    });
  };

  @Action(CalendarActions.SetMinDateRange)
  setMinDateRange(
    ctx: StateContext<CalendarStateModel>,
    action: CalendarActions.SetMinDateRange
  ) {

  };
}