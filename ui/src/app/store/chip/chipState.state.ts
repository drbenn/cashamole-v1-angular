import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { Chip, ChipStateStructure } from '../../model/chips.model';
import { ChipActions } from './chipState.actions';


export interface ChipStateModel {
  asset: Chip[],
  liability: Chip[],
  expense_category: Chip[],
  expense_vendor: Chip[],
  income_source: Chip[]
}

@State<ChipStateModel>({
  name: 'chip',
  defaults: {
    asset: [],
    liability: [],
    expense_category: [],
    expense_vendor: [],
    income_source: []
    },
  }
)
@Injectable()
export class ChipState {
  
  constructor(
    private store: Store,
    private router: Router
  ) {}


  @Selector() 
  static assetChips(state: ChipStateModel): Chip[] {
    return state.asset;
  };

  @Selector() 
  static liabilityChips(state: ChipStateModel): Chip[] {
    return state.liability;
  };

  @Selector() 
  static incomeSourceChips(state: ChipStateModel): Chip[] {
    return state.income_source;
  };

  @Selector() 
  static expenseCategoryChips(state: ChipStateModel): Chip[] {
    return state.expense_category;
  };

  @Selector() 
  static expenseVendorChips(state: ChipStateModel): Chip[] {
    return state.expense_vendor;
  };


  @Action(ChipActions.SetChipsOnLogin)
  setChipsOnLogin(
    ctx: StateContext<ChipStateModel>,
    action: ChipActions.SetChipsOnLogin
  ) {
    const organizedChips: ChipStateStructure = this.organizeChips(action.payload);
    ctx.patchState({ 
      asset: organizedChips.asset,
      liability: organizedChips.liability,
      expense_category: organizedChips.expense_category,
      expense_vendor: organizedChips.expense_vendor,
      income_source: organizedChips.income_source
    });
  };


  @Action(ChipActions.AddUserChip)
  addUserChip(
    ctx: StateContext<ChipStateModel>,
    action: ChipActions.AddUserChip
  ) {
    console.log('state chip payload');
    console.log(action.payload);
    const kind: string = action.payload.kind;
    const newChip: Chip = action.payload;

    if (kind === 'vendor') {
      let vendorChips: Chip[] = ctx.getState().expense_vendor;
      ctx.patchState({
        expense_vendor: [...vendorChips, newChip]
      })
    } else if (kind === 'category') {
      let categoryChips: Chip[] = ctx.getState().expense_category;
      ctx.patchState({
        expense_category: [...categoryChips, newChip]
      })
    } else if (kind === 'income') {
      let incomeChips: Chip[] = ctx.getState().income_source;
      ctx.patchState({
        income_source: [...incomeChips, newChip]
      })
    } else if (kind === 'asset') {
      let assetChips: Chip[] = ctx.getState().asset;
      ctx.patchState({
        asset: [...assetChips, newChip]
      })
    } else if (kind === 'liability') {
      let liabilityChips: Chip[] = ctx.getState().asset;
      ctx.patchState({
        liability: [...liabilityChips, newChip]
      })
    };
  };

  @Action(ChipActions.RemoveUserChip)
  removeUserChip(
    ctx: StateContext<ChipStateModel>,
    action: ChipActions.RemoveUserChip
  ) {
    const kind: string = action.payload.kind;
    const removeChip: Chip = action.payload;

    if (kind === 'vendor') {
      const state = ctx.getState().expense_vendor;
      ctx.patchState({
        expense_vendor: state.filter((chip: Chip) => chip.id !== removeChip.id )
      });
    } else if (kind === 'category') {
      const state = ctx.getState().expense_category;
      ctx.patchState({
        expense_category: state.filter((chip: Chip) => chip.id !== removeChip.id )
      });
    } else if (kind === 'income') {
      const state = ctx.getState().income_source;
      ctx.patchState({
        income_source: state.filter((chip: Chip) => chip.id !== removeChip.id )
      });
    } else if (kind === 'asset') {
      const state = ctx.getState().asset;
      ctx.patchState({
        asset: state.filter((chip: Chip) => chip.id !== removeChip.id )
      });
    } else if (kind === 'liability') {
      const state = ctx.getState().liability;
      ctx.patchState({
        liability: state.filter((chip: Chip) => chip.id !== removeChip.id )
      });
    };
  };


  private organizeChips(chips: any): ChipStateStructure {
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
      if (chip.kind === 'expense_category') {
        organizedChips.expense_category.push(chip);
      };
      if (chip.kind === 'expense_vendor') {
        organizedChips.expense_vendor.push(chip);
      };
      if (chip.kind === 'income_source') {
        organizedChips.income_source.push(chip);
      };
    });
    return organizedChips;
  }


  @Action(ChipActions.ClearChipStateOnLogout)
  clearChipStateOnLogout(
    ctx: StateContext<ChipStateModel>
  ) {
    ctx.patchState({ 
      asset: [],
      liability: [],
      expense_category: [],
      expense_vendor: [],
      income_source: []
    });
  };

}







