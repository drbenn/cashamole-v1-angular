import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { ExpenseActions } from './expense.actions';
import { Expense } from '../../models/core.model';
import { CoreApiService } from '../../api-services/core-api.service';
import { DashboardActions } from '../dashboard/dashboard.actions';




export interface ExpenseStateModel {
    expenses: Expense[],
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

  @Selector()
  static allMonthExpenses(state: ExpenseStateModel): Expense[] {
    return state.expenses;
  };

  @Action(ExpenseActions.SetExpensesOnLogin)
  setExpenseOnLogin(
    ctx: StateContext<ExpenseStateModel>,
    action: ExpenseActions.SetExpensesOnLogin
  ) {
    ctx.patchState({ 
      expenses: action.payload
    });
    this.updateDashboardExpenses(action.payload);
  }

  @Action(ExpenseActions.GetAndSetMonthExpenseRecords)
  getAndSetMonthExpenseRecords(
    ctx: StateContext<ExpenseStateModel>,
    action: ExpenseActions.GetAndSetMonthExpenseRecords
  ) {
    this.coreApi.getActiveExpenseRecordsByMonth(action.payload).subscribe((res: any) => {
      if (res.data === 'null') {
        this.store.dispatch(new DashboardActions.UpdateMonthExpenseTotal(null));
        ctx.patchState({ 
          expenses: []
        });
        this.updateDashboardExpenses([]);
      } else {
        const resData: Expense[] = JSON.parse(res.data)
        this.store.dispatch(new DashboardActions.UpdateMonthExpenseTotal(resData));
        ctx.patchState({
          expenses: resData
        });
        this.updateDashboardExpenses(resData);
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
    this.store.dispatch(new DashboardActions.UpdateMonthExpenseTotal(updatedExpenses));
    ctx.patchState({ expenses: updatedExpenses });
    this.updateDashboardExpenses(updatedExpenses);
  };

  @Action(ExpenseActions.EditUserExpenseRecord)
  editUserExpenseRecord(
      ctx: StateContext<ExpenseStateModel>,
      action: ExpenseActions.EditUserExpenseRecord
  ) {
    if (typeof action.payload.date === 'string') {
      const dateObject: Date = new Date(action.payload.date);
      action.payload.date = dateObject
    };   
    const year: string = action.payload.date.getFullYear().toString();
    const month: string = (action.payload.date.getMonth() + 1).toString().padStart(2, '0');
    const yearMonthId: string = `${year}-${month}`;
    this.store.dispatch(new ExpenseActions.GetAndSetMonthExpenseRecords(yearMonthId));
    // let currentExpenseRecords: Expense[] = ctx.getState().expenses;
    // currentExpenseRecords === null ? currentExpenseRecords = [] : currentExpenseRecords = currentExpenseRecords; 
    // const updatedExpenseRecords: Expense[] = [];
    // currentExpenseRecords.forEach((record: Expense) => {
    //   if (record.exp_id === action.payload.exp_id) {
    //     updatedExpenseRecords.push(action.payload);
    //   } else {
    //     updatedExpenseRecords.push(record);
    //   }
    // })
    // ctx.patchState({ expenses: updatedExpenseRecords });
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
      this.store.dispatch(new DashboardActions.UpdateMonthExpenseTotal(updatedExpenseRecords)); 
      ctx.patchState({ expenses: updatedExpenseRecords });
      this.updateDashboardExpenses(updatedExpenseRecords);
  };

  private updateDashboardExpenses(expenses: Expense[]) {
    this.store.dispatch(new DashboardActions.SetMonthExpensesForDashboard(expenses));
  };
}