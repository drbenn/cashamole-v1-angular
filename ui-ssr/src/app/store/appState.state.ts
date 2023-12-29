import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Increment, SetUserDataOnLogin, UpdateChips } from './appState.actions';



export interface AppStateModel {
  data: any;
  name: string,
  defaults: number
}

@State<AppStateModel>({
  name: 'appState',
  defaults: {
    data: '',
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

  // @Action(UpdateChips)
  // updateChips(
  //   ctx: StateContext<AppStateModel>,
  //   payload: { data: any }
  // ) {
  //   ctx.patchState({ chips: payload.data });
  // }

  @Action(Increment)
  increment(ctx: StateContext<number>) {
    console.log('INCREMENT');
    console.log(AppState);
    
    ctx.setState(counter => (counter += 1));
  }
}