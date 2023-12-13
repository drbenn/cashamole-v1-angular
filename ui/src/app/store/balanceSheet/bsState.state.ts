import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { BalancSheetActions } from './bsState.actions';
import { BalanceSheetEntry } from '../../model/core.model';


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
    private router: Router
    ) {}



    @Action(BalancSheetActions.SetBalanceSheetEntriesOnLogin)
    SstBalanceSheetEntriesOnLogin(
      ctx: StateContext<BalanceSheetStateModel>,
      action: BalancSheetActions.SetBalanceSheetEntriesOnLogin
    ) {
      ctx.patchState({ 
        entries: action.payload
      });
    }

    @Action(BalancSheetActions.AddUserBalanceRecord)
    addUserBalanceRecord(
        ctx: StateContext<BalanceSheetStateModel>,
        action: BalancSheetActions.AddUserBalanceRecord
    ) {
        let currentBalanceRecords: BalanceSheetEntry[] = ctx.getState().entries;
        currentBalanceRecords === null ? currentBalanceRecords = [] : currentBalanceRecords = currentBalanceRecords; 
        currentBalanceRecords.push(action.payload);
        const updatedBalanceRecords: BalanceSheetEntry[] = currentBalanceRecords.map((obj: BalanceSheetEntry) => obj);
        ctx.patchState({ entries: updatedBalanceRecords });
    };

    @Action(BalancSheetActions.EditUserBalanceRecord)
    editUserBalanceRecord(
        ctx: StateContext<BalanceSheetStateModel>,
        action: BalancSheetActions.EditUserBalanceRecord
    ) {
        let currentBalanceRecords: BalanceSheetEntry[] = ctx.getState().entries;
        currentBalanceRecords === null ? currentBalanceRecords = [] : currentBalanceRecords = currentBalanceRecords; 
        const updatedBalanceRecords: BalanceSheetEntry[] = [];
        currentBalanceRecords.forEach((record: BalanceSheetEntry) => {
          if (record.record_id === action.payload.record_id) {
            updatedBalanceRecords.push(action.payload);
          } else {
            updatedBalanceRecords.push(record);
          }
        })
        ctx.patchState({ entries: updatedBalanceRecords });
    };

    @Action(BalancSheetActions.DeactivateUserBalanceRecord)
    deactivateUserBalanceRecord(
        ctx: StateContext<BalanceSheetStateModel>,
        action: BalancSheetActions.DeactivateUserBalanceRecord
    ) {
        let currentBalanceRecords: BalanceSheetEntry[] = ctx.getState().entries;
        currentBalanceRecords === null ? currentBalanceRecords = [] : currentBalanceRecords = currentBalanceRecords; 
        const updatedBalanceRecords: BalanceSheetEntry[] = [];
        currentBalanceRecords.forEach((record: BalanceSheetEntry) => {
          if (record.record_id !== action.payload.record_id || 
              record.amount !== action.payload.amount && record.date !== action.payload.date && 
              record.type !== action.payload.type && record.description !== action.payload.description 
          ) {
            updatedBalanceRecords.push(action.payload);
          };
        })
        ctx.patchState({ entries: updatedBalanceRecords });
    };
}