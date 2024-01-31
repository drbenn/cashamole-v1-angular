import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { IncomeActions } from './income.actions';
import { Income } from '../../models/core.model';
import { CoreApiService } from '../../api-services/core-api.service';
import { DashboardActions } from '../dashboard/dashboard.actions';


export interface IncomeStateModel {
    income: Income[]
}

@State<IncomeStateModel>({
  name: 'income',
  defaults: {
        income: []
    },
  }
)
@Injectable()
export class IncomeState {
  constructor(
    private store: Store,
    private coreApi: CoreApiService
  ) {}

  @Selector()
  static allMonthIncome(state: IncomeStateModel): Income[] {
    return state.income;
  };

  @Action(IncomeActions.SetIncomeOnLogin)
  setIncomeOnLogin(
    ctx: StateContext<IncomeStateModel>,
    action: IncomeActions.SetIncomeOnLogin
  ) {
    ctx.patchState({ 
      income: action.payload
    });
  };

  @Action(IncomeActions.GetAndSetMonthIncomeRecords)
  getAndSetMonthIncomeRecords(
    ctx: StateContext<IncomeStateModel>,
    action: IncomeActions.GetAndSetMonthIncomeRecords
  ) {
    this.coreApi.getActiveIncomeRecordsByMonth(action.payload).subscribe((res: any) => {
      if (res.data === 'null') {
        this.store.dispatch(new DashboardActions.UpdateMonthIncomeTotal(null));
        ctx.patchState({ 
          income: []
        });
      } else {
        const resData: Income[] = JSON.parse(res.data)
        this.store.dispatch(new DashboardActions.UpdateMonthIncomeTotal(resData));
        ctx.patchState({ 
          income: JSON.parse(res.data)
        });
      };
    });
  };

  @Action(IncomeActions.AddIncome)
  addIncome(
    ctx: StateContext<IncomeStateModel>,
    action: IncomeActions.AddIncome
  ) {
    let updatedIncome: Income[] = ctx.getState().income;
    updatedIncome === null ? updatedIncome = [] : updatedIncome = updatedIncome; 
    updatedIncome.push(action.payload);
    this.store.dispatch(new DashboardActions.UpdateMonthIncomeTotal(updatedIncome));
    ctx.patchState({ income: updatedIncome });
  };

  @Action(IncomeActions.EditIncomeRecord)
  editUserIncomeRecord(
      ctx: StateContext<IncomeStateModel>,
      action: IncomeActions.EditIncomeRecord
  ) {
    if (typeof action.payload.date === 'string') {
      const dateObject: Date = new Date(action.payload.date);
      action.payload.date = dateObject
    };   
    const year: string = action.payload.date.getFullYear().toString();
    const month: string = (action.payload.date.getMonth() + 1).toString().padStart(2, '0');
    const yearMonthId: string = `${year}-${month}`;
    this.store.dispatch(new IncomeActions.GetAndSetMonthIncomeRecords(yearMonthId));
  };

  @Action(IncomeActions.DeactivateUserIncomeRecord)
  deactivateUserIncomeRecord(
      ctx: StateContext<IncomeStateModel>,
      action: IncomeActions.DeactivateUserIncomeRecord
  ) {
      let currentIncomeRecords: Income[] = ctx.getState().income;
      currentIncomeRecords === null ? currentIncomeRecords = [] : currentIncomeRecords = currentIncomeRecords; 
      const updatedIncomeRecords: Income[] = [];
      currentIncomeRecords.forEach((record: Income) => {
        if (record.inc_id !== action.payload.inc_id) {
          updatedIncomeRecords.push(record);
        };
      });
      this.store.dispatch(new DashboardActions.UpdateMonthIncomeTotal(updatedIncomeRecords)); 
      ctx.patchState({ income: updatedIncomeRecords });
  };

}