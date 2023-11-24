import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Increment, SetUserDataOnLogin, UpdateChips } from './appState.actions';
import { UserChips } from '../shared/models/chips.model';





export interface AppStateModel {
  data: any;
  chips: UserChips;
  name: string,
  defaults: number
}

@State<AppStateModel>({
  name: 'appState',
  defaults: {
    data: '',
    chips: {
      transPayeeChips: [],
      balanceChips: []
    },
    name: 'counter',
    defaults: 0
  },
})
@Injectable()
export class AppState {

  constructor(
    private store: Store
  ) {}


  @Action(SetUserDataOnLogin)
  setUserDataOnLogin(
    ctx: StateContext<AppStateModel>,
    payload: { data: any }
  ) {
    ctx.patchState({ data: payload.data });
  }

  @Action(UpdateChips)
  updateChips(
    ctx: StateContext<AppStateModel>,
    payload: { data: any }
  ) {
    ctx.patchState({ chips: payload.data });
  }

  @Action(Increment)
  increment(ctx: StateContext<number>) {
    console.log('INCREMENT');
    console.log(AppState);
    
    ctx.setState(counter => (counter += 1));
  }
}