import { Chip } from "../../model/chips.model";

export namespace ChipActions {

  export class SetChipsOnLogin {
    static readonly type =  '[Chip] Set user chips on login';
    constructor(public payload: any) {}
  }

  export class AddUserChip {
    static readonly type =  '[Chip] Add user chip';
    constructor(public payload: Chip) {}
  }

  export class RemoveUserChip {
    static readonly type =  '[Chip] Remove user chip';
    constructor(public payload: Chip) {}
  }

  export class ClearChipStateOnLogout {
    static readonly type =  '[Chip] Clear chip state data on logout';
  }
}