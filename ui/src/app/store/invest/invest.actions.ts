import { Invest } from "../../models/core.model";

export namespace InvestActions {

  export class SetInvestOnLogin {
      static readonly type =  '[Invest] Set invest on login';
      constructor(public payload: any) {}
  };

  export class GetAndSetMonthInvestRecords {
    static readonly type =  '[Invest] Get and set entries on month change';
    constructor(public payload: string) {}
};

  export class SetMonthInvestRecords {
    static readonly type =  '[Invest] Set entries on month change';
    constructor(public payload: Invest[]) {}
  };

  export class AddInvest {
    static readonly type =  '[Invest] Add invest record';
    constructor(public payload: Invest) {}
  };

  export class EditInvestRecord {
    static readonly type =  '[Invest] Edit user invest record';
    constructor(public payload: Invest) {}
  };

  export class DeactivateUserInvestRecord {
      static readonly type =  '[Invest] Deactivate user invest record';
      constructor(public payload: Invest) {}
  };


}