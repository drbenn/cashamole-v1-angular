import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { Expense } from '../../model/models.model';
import { ExpenseActions } from './expese.actions';




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
    private router: Router
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
}