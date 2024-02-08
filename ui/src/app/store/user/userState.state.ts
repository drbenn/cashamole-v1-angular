import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, State, StateContext, Store } from '@ngxs/store';
import { User } from '../../models/user.models';
import { UserActions } from './userState.actions';
import { CookieService } from 'ngx-cookie-service';
import { UserApiService } from '../../api-services/user-api.service';
import { Router } from '@angular/router';
import { ChipActions } from '../chip/chipState.actions';
import { BalanceSheetActions } from '../balanceSheet/bsState.actions';
import { ExpenseActions } from '../expense/expense.actions';
import { IncomeActions } from '../income/income.actions';
import { CalendarActions } from '../calendar/calendar.actions';
import { InvestActions } from '../invest/invest.actions';
import { DashboardActions } from '../dashboard/dashboard.actions';


export interface UserStateModel {
  isInitUserDataChecked: boolean,
  isInitUserDataLoaded: boolean,
  loggedInUser: User
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    isInitUserDataChecked: false,
    isInitUserDataLoaded: false,
    loggedInUser: {} as User
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

    console.log('ngxs on init triggered and checking for existing cookies => redirect to appropriate home/dashboard if so');
    console.log('cashamole userIdCookie retrieved: ', userIdCookie);
    console.log('cashamole userTokenCookie retrieved: ', userTokenCookie);
    
    
    
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
    console.log('income being set from setUserDataOnLogin --- userState');
    console.log(action.payload.income);
    
    
    this.store.dispatch(new CalendarActions.SetCalendarOnLogin());
    this.store.dispatch(new IncomeActions.SetIncomeOnLogin(action.payload.income));
    this.store.dispatch(new InvestActions.SetInvestOnLogin(action.payload.investments));
    this.store.dispatch(new ExpenseActions.SetExpensesOnLogin(action.payload.expenses));
    this.store.dispatch(new BalanceSheetActions.SetBalanceSheetEntriesOnLogin(action.payload.balanceSheetEntries));
    this.store.dispatch(new ChipActions.SetChipsOnLogin(action.payload.chips));
    this.store.dispatch(new DashboardActions.SetDashboardHistoryOnLogin(action.payload.dashboardHistory));
    ctx.patchState({ 
      isInitUserDataLoaded: true,
      loggedInUser: action.payload.basicProfile
    });
  };


  @Action(UserActions.ClearUserStateOnLogout)
  clearUserStateOnLogout(
    ctx: StateContext<UserStateModel>
  ) {
    this.store.dispatch(new ChipActions.ClearChipStateOnLogout());
    ctx.patchState({     
      isInitUserDataLoaded: false,
      loggedInUser: {} as User,
    });
  };
  
  @Action(UserActions.TriggerUserCookieCheck)
  triggerUserCookieCheck(
    ctx: StateContext<UserStateModel>
  ) {
    console.log('trigger cookie check action fired in state');
    
    ctx.patchState({     
      isInitUserDataChecked: true
    });
  };
}








