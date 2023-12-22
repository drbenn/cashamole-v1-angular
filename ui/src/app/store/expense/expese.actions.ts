import { Expense } from "../../model/core.model";

export namespace ExpenseActions {

    export class SetExpensesOnLogin {
        static readonly type =  '[Expense] Set expenses on login';
        constructor(public payload: any) {}
    };

    export class AddExpense {
        static readonly type =  '[Expense] Add expense record';
        constructor(public payload: Expense) {}
    };

    export class EditUserExpenseRecord {
        static readonly type =  '[Expense] Edit user expense record';
        constructor(public payload: Expense) {}
    };

    export class DeactivateUserExpenseRecord {
        static readonly type =  '[Expense] Deactivate user expense record';
        constructor(public payload: Expense) {}
    };
    

    
}