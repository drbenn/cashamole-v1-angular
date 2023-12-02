import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, State, StateContext, Store } from '@ngxs/store';
import { User, UserLoginData } from '../../model/user.models';
import { UserActions } from './userState.actions';
import { TransactionBody } from '../../model/transaction.model';
import { CookieService } from 'ngx-cookie-service';
import { UserApiService } from '../../shared/api/user-api.service';
import { Router } from '@angular/router';
import { Chip } from '../../model/chips.model';
import { BalanceSheetEntry } from '../../model/models.model';


export interface UserStateModel {
  isInitUserDataLoaded: boolean,
  loggedInUser: User,
  transactions: TransactionBody[],
  balanceSheetEntries: BalanceSheetEntry[],
  chips: Chip[],
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    isInitUserDataLoaded: false,
    loggedInUser: {} as User,
    transactions: [],
    balanceSheetEntries: [],
    chips: [],
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
  };

  @Action(UserActions.RegisterLoggedInUser)
  registerLoggedInUser(
    ctx: StateContext<UserStateModel>,
    action: UserActions.RegisterLoggedInUser
  ) {
    ctx.patchState({ loggedInUser: action.payload });
  };


  @Action(UserActions.SetUserDataOnLogin)
  setUserDataOnLogin(
    ctx: StateContext<UserStateModel>,
    action: UserActions.SetUserDataOnLogin
  ) {    

    console.log(action.payload);
    
    ctx.patchState({ 
      isInitUserDataLoaded: true,
      loggedInUser: action.payload.basicProfile,
      transactions: action.payload.transactions,
      balanceSheetEntries: action.payload.balanceSheetEntries,
      chips: action.payload.chips
    });
  };

  @Action(UserActions.AddUserTransaction)
  addUserTransaction(
    ctx: StateContext<UserStateModel>,
    action: UserActions.AddUserTransaction
  ) {
    let updatedTransactions: TransactionBody[] = ctx.getState().transactions;
    updatedTransactions === null ? updatedTransactions = [] : updatedTransactions = updatedTransactions; 
    updatedTransactions.push(action.payload);
    ctx.patchState({ transactions: updatedTransactions });
  };

  @Action(UserActions.AddUserBalanceRecord)
  addUserBalanceRecord(
    ctx: StateContext<UserStateModel>,
    action: UserActions.AddUserBalanceRecord
  ) {
    console.log('in BS STATE');
    console.log(action.payload);
    
    let updatedBalanceRecords: BalanceSheetEntry[] = ctx.getState().balanceSheetEntries;
    updatedBalanceRecords === null ? updatedBalanceRecords = [] : updatedBalanceRecords = updatedBalanceRecords; 
    updatedBalanceRecords.push(action.payload);
    ctx.patchState({ balanceSheetEntries: updatedBalanceRecords });
  };

  @Action(UserActions.AddUserChip)
  addUserChip(
    ctx: StateContext<UserStateModel>,
    action: UserActions.AddUserChip
  ) {
    let updatedChips: Chip[] = ctx.getState().chips;   
    updatedChips === null ? updatedChips = [] : updatedChips = updatedChips; 
    updatedChips.push(action.payload);
    ctx.patchState({ chips: updatedChips });
  };

  @Action(UserActions.RemoveUserChip)
  removeUserChip(
    ctx: StateContext<UserStateModel>,
    action: UserActions.RemoveUserChip
  ) {
      const stateChips: Chip[] = ctx.getState().chips;
      const updatedChips: Chip[] = stateChips.filter((chip: Chip) => {
      const stateChipJoin: string = chip.chip + chip.kind;
      const removeChipJoin: string = action.payload.chip + action.payload.kind;
      if (removeChipJoin !== stateChipJoin) {
        return true;
      } else {
        return false;
      }
    });
    ctx.patchState({ chips: updatedChips });
  };

  @Action(UserActions.ClearUserStateOnLogout)
  clearUserStateOnLogout(
    ctx: StateContext<UserStateModel>
  ) {
    ctx.patchState({     
      isInitUserDataLoaded: false,
      loggedInUser: {} as User,
      transactions: [],
      balanceSheetEntries: [],
      chips: []
    });
  };

}








