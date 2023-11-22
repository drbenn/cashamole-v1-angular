import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SetUserDataOnLogin } from './appState.actions';





export interface AppStateModel {
  data: any;
}

@State<AppStateModel>({
  name: 'appState',
  defaults: {
    data: '',
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


}