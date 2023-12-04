import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { User, UserLoginData } from '../../model/user.models';
import { UserActions } from './userState.actions';
import { TransactionBody } from '../../model/transaction.model';
import { CookieService } from 'ngx-cookie-service';
import { UserApiService } from '../../shared/api/user-api.service';
import { Router } from '@angular/router';
import { Chip } from '../../model/chips.model';
import { BalanceSheetEntry, ChipStateStructure } from '../../model/models.model';


export interface UserStateModel {
  isInitUserDataLoaded: boolean,
  loggedInUser: User,
  transactions: TransactionBody[],
  balanceSheetEntries: BalanceSheetEntry[],
  chips: ChipStateStructure
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    isInitUserDataLoaded: false,
    loggedInUser: {} as User,
    transactions: [],
    balanceSheetEntries: [],
    chips: {
      asset: [],
      liability: [],
      expense_category: [],
      expense_vendor: [],
      income_source: [] 
    },
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

  @Selector() 
  static assetChips(state: UserStateModel): Chip[] {
    return state.chips.asset;
  }

  @Selector() 
  static liabilityChips(state: UserStateModel): Chip[] {
    return state.chips.liability;
  }

  @Selector() 
  static incomeSourceChips(state: UserStateModel): Chip[] {
    return state.chips.income_source;
  }

  @Selector() 
  static expenseCategoryChips(state: UserStateModel): Chip[] {
    return state.chips.expense_category;
  }

  @Selector() 
  static expenseVendorChips(state: UserStateModel): Chip[] {
    return state.chips.expense_vendor;
  }

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
    const organizedChips: ChipStateStructure = this.organizeChips(action.payload.chips);
    console.log(organizedChips);
    
    ctx.patchState({ 
      isInitUserDataLoaded: true,
      loggedInUser: action.payload.basicProfile,
      transactions: action.payload.transactions,
      balanceSheetEntries: action.payload.balanceSheetEntries,
      chips: organizedChips
    });
  };

  organizeChips(chips: any): ChipStateStructure {
    console.log('in sort chips');
    console.log(chips);
    const organizedChips: ChipStateStructure = {
      asset: [],
      liability: [],
      expense_category: [],
      expense_vendor: [],
      income_source: [] 
    }
    chips.forEach((chip: Chip) => {
      if (chip.kind === 'asset') {
        organizedChips.asset.push(chip);
      };
      if (chip.kind === 'liability') {
        organizedChips.liability.push(chip);
      };
      if (chip.kind === 'category') {
        organizedChips.expense_category.push(chip);
      };
      if (chip.kind === 'vendor') {
        organizedChips.expense_vendor.push(chip);
      };
      if (chip.kind === 'income') {
        organizedChips.income_source.push(chip);
      };
    });

    return organizedChips;
    
  }

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
    let currentBalanceRecords: BalanceSheetEntry[] = ctx.getState().balanceSheetEntries;
    currentBalanceRecords === null ? currentBalanceRecords = [] : currentBalanceRecords = currentBalanceRecords; 
    currentBalanceRecords.push(action.payload);
    const updatedBalanceRecords: BalanceSheetEntry[] = currentBalanceRecords.map((obj: BalanceSheetEntry) => obj);
    ctx.patchState({ balanceSheetEntries: updatedBalanceRecords });
  };

  @Action(UserActions.AddUserChip)
  addUserChip(
    ctx: StateContext<UserStateModel>,
    action: UserActions.AddUserChip
  ) {
    console.log('state chip payload');
    console.log(action.payload);
    const blankChipsObject: ChipStateStructure = {
      asset: [],
      liability: [],
      expense_category: [],
      expense_vendor: [],
      income_source: [] 
    };
    const chipKind: string = action.payload.kind;
    console.log(chipKind);
    
    let currentChips: ChipStateStructure = ctx.getState().chips;   
    currentChips === null ? currentChips = blankChipsObject: currentChips = currentChips;
    const nonRefChips: ChipStateStructure = currentChips;
    console.log(currentChips.asset);
    if (chipKind === 'asset') {
      nonRefChips.asset.push(action.payload);
    } else if (chipKind === 'liabilty') {
      nonRefChips.liability.push(action.payload);
    }
    // todo: need to add other if options
    ctx.patchState({ chips: nonRefChips });
  };

  @Action(UserActions.RemoveUserChip)
  removeUserChip(
    ctx: StateContext<UserStateModel>,
    action: UserActions.RemoveUserChip
  ) {
    console.log('remove paylo0ad');
    console.log(action.payload);
    
    
      let currentChips: ChipStateStructure = ctx.getState().chips;
      // if (chipKind === 'asset') {
      //   nonRefChips.asset.push(action.payload);
      // } else if (chipKind === 'liabilty') {
      //   nonRefChips.liability.push(action.payload);
      // }
      // todo: need to add other if options
    //   const updatedChips: Chip[] = stateChips.filter((chip: Chip) => {
    //   const stateChipJoin: string = chip.chip + chip.kind;
    //   const removeChipJoin: string = action.payload.chip + action.payload.kind;
    //   if (removeChipJoin !== stateChipJoin) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });
    // ctx.patchState({ chips: updatedChips });
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
      chips:  {
        asset: [],
        liability: [],
        expense_category: [],
        expense_vendor: [],
        income_source: [] 
      }
    });
  };

}








