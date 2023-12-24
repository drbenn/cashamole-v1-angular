import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { ExpenseActions } from './expese.actions';
import { Expense } from '../../model/core.model';
import { CoreApiService } from '../../shared/api/core-api.service';




export interface ExpenseStateModel {
    expenses: Expense[]
}

@State<ExpenseStateModel>({
  name: 'expense',
  defaults: {
        expenses: []
    },
  }
)
@Injectable()
export class ExpenseState {
  constructor(
    private store: Store,
    private router: Router,
    private coreApi: CoreApiService
    ) {}


  @Action(ExpenseActions.SetExpensesOnLogin)
  setExpenseOnLogin(
    ctx: StateContext<ExpenseStateModel>,
    action: ExpenseActions.SetExpensesOnLogin
  ) {
    ctx.patchState({ 
      expenses: action.payload
    });
  }

  @Action(ExpenseActions.GetAndSetMonthExpenseRecords)
  getAndSetMonthExpenseRecords(
    ctx: StateContext<ExpenseStateModel>,
    action: ExpenseActions.GetAndSetMonthExpenseRecords
  ) {
    this.coreApi.getActiveExpenseRecordsByMonth(action.payload).subscribe((res: any) => {
      if (res.data === 'null') {
        ctx.patchState({ 
          expenses: []
        });
      } else {
        ctx.patchState({ 
          expenses: JSON.parse(res.data)
        });
      };
    });
  };

  @Action(ExpenseActions.AddExpense)
  addExpense(
    ctx: StateContext<ExpenseStateModel>,
    action: ExpenseActions.AddExpense
  ) {
    let updatedExpenses: Expense[] = ctx.getState().expenses;
    updatedExpenses === null ? updatedExpenses = [] : updatedExpenses = updatedExpenses; 
    updatedExpenses.push(action.payload);
    ctx.patchState({ expenses: updatedExpenses });
  };

  @Action(ExpenseActions.DeactivateUserExpenseRecord)
  deactivateUserExpenseRecord(
      ctx: StateContext<ExpenseStateModel>,
      action: ExpenseActions.DeactivateUserExpenseRecord
  ) {
      let currentExpenseRecords: Expense[] = ctx.getState().expenses;
      currentExpenseRecords === null ? currentExpenseRecords = [] : currentExpenseRecords = currentExpenseRecords; 
      const updatedExpenseRecords: Expense[] = [];
      currentExpenseRecords.forEach((record: Expense) => {
        if (record.exp_id !== action.payload.exp_id) {
          updatedExpenseRecords.push(record);
        };
      });    
      ctx.patchState({ expenses: updatedExpenseRecords });
  };
}