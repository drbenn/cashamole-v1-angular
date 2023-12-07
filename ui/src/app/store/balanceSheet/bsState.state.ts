import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { BalanceSheetEntry } from '../../model/models.model';
import { BalancSheetActions } from './bsState.actions';


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
}