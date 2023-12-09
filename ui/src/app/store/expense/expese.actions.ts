import { Expense } from "../../model/core.model";

export namespace ExpenseActions {

    export class SetExpensesOnLogin {
        static readonly type =  '[Expense] Set expenses on login';
        constructor(public payload: any) {}
    }

    export class AddExpense {
        static readonly type =  '[Expense] Add expense';
        constructor(public payload: Expense) {}
      }
    

    
}