import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, State, StateContext, Store } from '@ngxs/store';
import { User, UserLoginData } from '../../model/user.models';
import { UserActions } from './userState.actions';
import { TransactionBody } from '../../model/transaction.model';
import { CookieService } from 'ngx-cookie-service';
import { UserApiService } from '../../shared/api/user-api.service';
import { Router } from '@angular/router';
import { BalanceSheetEntryBody } from '../../model/balanceSheet.model';


export interface UserStateModel {
  isInitUserDataLoaded: boolean,
  loggedInUser: User,
  transactions: TransactionBody[],
  balanceSheetEntries: BalanceSheetEntryBody[],
  chips: any,
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    isInitUserDataLoaded: false,
    loggedInUser: {} as User,
    transactions: [],
    balanceSheetEntries: [],
    chips: '',
  }
})
@Injectable()
export class UserState implements NgxsOnInit {
  constructor(
    private cookieService: CookieService,
    private userApi: UserApiService,
    private store: Store,
    private router: Router
    ) {}

  ngxsOnInit(ctx: StateContext<UserState>) {
    const userIdCookie: number = <number><unknown>this.cookieService.get('cashamole_uid');
    const userTokenCookie: string = this.cookieService.get('cashamole_user_token');
    
    if (userIdCookie && userTokenCookie) {
      this.userApi.loginCachedUser(userIdCookie).subscribe({
        next: (userLogin: any) => {
          this.store.dispatch(new UserActions.SetUserDataOnLogin(JSON.parse(userLogin.data)));
          this.router.navigate(['home']);
        },
        error: (err: any) => console.log(err)
      });
    };
  }

  @Action(UserActions.RegisterLoggedInUser)
  registerLoggedInUser(
    ctx: StateContext<UserStateModel>,
    action: UserActions.RegisterLoggedInUser
  ) {
    ctx.patchState({ loggedInUser: action.payload });
  }


  @Action(UserActions.SetUserDataOnLogin)
  setUserDataOnLogin(
    ctx: StateContext<UserStateModel>,
    action: UserActions.SetUserDataOnLogin
  ) {
    ctx.patchState({ 
      isInitUserDataLoaded: true,
      loggedInUser: action.payload.profile,
      transactions: action.payload.transactions,
      balanceSheetEntries: action.payload.balanceSheetEntries,
      chips: action.payload.chips
    });
  }


  @Action(UserActions.AddUserTransaction)
  addUserTransaction(
    ctx: StateContext<UserStateModel>,
    action: UserActions.AddUserTransaction
  ) {
    const updatedTransactions: TransactionBody[] = ctx.getState().transactions;
    updatedTransactions.push(action.payload);
    console.log('in action');
    console.log(updatedTransactions);
    
    
    ctx.patchState({ transactions: updatedTransactions });
  };

  @Action(UserActions.AddUserBalanceRecord)
  addUserBalanceRecord(
    ctx: StateContext<UserStateModel>,
    action: UserActions.AddUserBalanceRecord
  ) {
    const updatedBalanceRecords: BalanceSheetEntryBody[] = ctx.getState().balanceSheetEntries;
    updatedBalanceRecords.push(action.payload);
    ctx.patchState({ balanceSheetEntries: updatedBalanceRecords });
  };
}








