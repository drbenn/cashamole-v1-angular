import { Income } from "../../model/core.model";

export namespace IncomeActions {

  export class SetIncomeOnLogin {
      static readonly type =  '[Income] Set income on login';
      constructor(public payload: any) {}
  };

  export class AddIncome {
    static readonly type =  '[Income] Add income record';
    constructor(public payload: Income) {}
  };

  export class EditIncomeRecord {
    static readonly type =  '[Income] Edit user income record';
    constructor(public payload: Income) {}
  };

  export class DeactivateUserIncomeRecord {
      static readonly type =  '[Income] Deactivate user income record';
      constructor(public payload: Income) {}
  };


}

