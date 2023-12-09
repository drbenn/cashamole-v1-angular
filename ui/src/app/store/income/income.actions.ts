import { Income } from "../../model/core.model";

export namespace IncomeActions {

  export class SetIncomeOnLogin {
      static readonly type =  '[Income] Set income on login';
      constructor(public payload: any) {}
  }

  export class AddIncome {
    static readonly type =  '[Income] Add income';
    constructor(public payload: Income) {}
  }


}

