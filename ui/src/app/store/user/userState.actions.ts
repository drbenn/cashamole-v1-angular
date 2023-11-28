import { BalanceSheetEntryBody } from "../../model/balanceSheet.model";
import { Chip } from "../../model/chips.model";
import { TransactionBody } from "../../model/transaction.model";
import { User, UserLoginData } from "../../model/user.models";

export namespace UserActions {

  export class RegisterLoggedInUser {
    static readonly type =  '[User] Register logged in user';
    constructor(public payload: User) {}
  }

  export class SetUserDataOnLogin {
    static readonly type =  '[User] Set user data on login';
    constructor(public payload: UserLoginData) {}
  }

  export class AddUserTransaction {
    static readonly type =  '[Transaction] Add user transaction';
    constructor(public payload: TransactionBody) {}
  }

  export class AddUserBalanceRecord {
    static readonly type =  '[Balance Record] Add user balance record';
    constructor(public payload: BalanceSheetEntryBody) {}
  }

  export class AddUserChip {
    static readonly type =  '[Chip] Add user chip';
    constructor(public payload: Chip) {}
  }

  export class RemoveUserChip {
    static readonly type =  '[Chip] Remove user chip';
    constructor(public payload: Chip) {}
  }
}