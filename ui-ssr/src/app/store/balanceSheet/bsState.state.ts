import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { BalanceSheetActions } from './bsState.actions';
import { BalanceSheetEntry } from '../../model/core.model';
import { CoreApiService } from '../../shared/api/core-api.service';
import { DashboardActions } from '../dashboard/dashboard.actions';


export interface BalanceSheetStateModel {
    entries: BalanceSheetEntry[]
}

@State<BalanceSheetStateModel>({
  name: 'balanceSheet',
  defaults: {
        entries: []
    },
  }
)
@Injectable()
export class BalanceSheetState {
  constructor(
    private store: Store,
    private router: Router,
    private coreApi: CoreApiService
    ) {}



    @Action(BalanceSheetActions.SetBalanceSheetEntriesOnLogin)
    SetBalanceSheetEntriesOnLogin(
      ctx: StateContext<BalanceSheetStateModel>,
      action: BalanceSheetActions.SetBalanceSheetEntriesOnLogin
    ) {
      ctx.patchState({ 
        entries: action.payload
      });
    }

    @Action(BalanceSheetActions.GetAndSetMonthBalanceRecords)
    getAndSetMonthBalanceRecords(
      ctx: StateContext<BalanceSheetStateModel>,
      action: BalanceSheetActions.GetAndSetMonthBalanceRecords
    ) {
      this.coreApi.getActiveBalanceRecordsByMonth(action.payload).subscribe((res: any) => {
        if (res.data === 'null') {
          this.store.dispatch(new DashboardActions.UpdateMonthBalanceSheetTotal(null));
          ctx.patchState({ 
            entries: []
          });
        } else {
          const resData: BalanceSheetEntry[] = JSON.parse(res.data)
          this.store.dispatch(new DashboardActions.UpdateMonthBalanceSheetTotal(resData));
          ctx.patchState({ 
            entries: JSON.parse(res.data)
          });
        };
      });
    };

    @Action(BalanceSheetActions.AddUserBalanceRecord)
    addUserBalanceRecord(
        ctx: StateContext<BalanceSheetStateModel>,
        action: BalanceSheetActions.AddUserBalanceRecord
    ) {
        let currentBalanceRecords: BalanceSheetEntry[] = ctx.getState().entries;
        currentBalanceRecords === null ? currentBalanceRecords = [] : currentBalanceRecords = currentBalanceRecords; 
        currentBalanceRecords.push(action.payload);
        const updatedBalanceRecords: BalanceSheetEntry[] = currentBalanceRecords.map((obj: BalanceSheetEntry) => obj);
        this.store.dispatch(new DashboardActions.UpdateMonthBalanceSheetTotal(updatedBalanceRecords));
        ctx.patchState({ entries: updatedBalanceRecords });
    };

    @Action(BalanceSheetActions.EditUserBalanceRecord)
    editUserBalanceRecord(
        ctx: StateContext<BalanceSheetStateModel>,
        action: BalanceSheetActions.EditUserBalanceRecord
    ) {
      if (typeof action.payload.date === 'string') {
        const dateObject: Date = new Date(action.payload.date);
        action.payload.date = dateObject
      };   
      const year: string = action.payload.date.getFullYear().toString();
      const month: string = (action.payload.date.getMonth() + 1).toString().padStart(2, '0');
      const yearMonthId: string = `${year}-${month}`;
      this.store.dispatch(new BalanceSheetActions.GetAndSetMonthBalanceRecords(yearMonthId));
      // let currentBalanceRecords: BalanceSheetEntry[] = ctx.getState().entries;
      // currentBalanceRecords === null ? currentBalanceRecords = [] : currentBalanceRecords = currentBalanceRecords; 
      // const updatedBalanceRecords: BalanceSheetEntry[] = [];
      // currentBalanceRecords.forEach((record: BalanceSheetEntry) => {
      //   if (record.record_id === action.payload.record_id) {
      //     updatedBalanceRecords.push(action.payload);
      //   } else {
      //     updatedBalanceRecords.push(record);
      //   }
      // })
      // ctx.patchState({ entries: updatedBalanceRecords });
    };

    @Action(BalanceSheetActions.DeactivateUserBalanceRecord)
    deactivateUserBalanceRecord(
        ctx: StateContext<BalanceSheetStateModel>,
        action: BalanceSheetActions.DeactivateUserBalanceRecord
    ) {
        let currentBalanceRecords: BalanceSheetEntry[] = ctx.getState().entries;
        currentBalanceRecords === null ? currentBalanceRecords = [] : currentBalanceRecords = currentBalanceRecords; 
        const updatedBalanceRecords: BalanceSheetEntry[] = [];
        currentBalanceRecords.forEach((record: BalanceSheetEntry) => {
          if (record.record_id !== action.payload.record_id) {
            updatedBalanceRecords.push(record);
          };
        });
        this.store.dispatch(new DashboardActions.UpdateMonthBalanceSheetTotal(updatedBalanceRecords)); 
        ctx.patchState({ entries: updatedBalanceRecords });
    };
}