import { User, UserLoginData } from "../../models/user.models";

export namespace UserActions {

  export class RegisterLoggedInUser {
    static readonly type =  '[User] Register logged in user';
    constructor(public payload: User) {}
  };

  export class SetUserDataOnLogin {
    static readonly type =  '[User] Set user data on login';
    constructor(public payload: UserLoginData) {}
  };

  export class ClearUserStateOnLogout {
    static readonly type =  '[User] Clear user state data on logout';
  };
}