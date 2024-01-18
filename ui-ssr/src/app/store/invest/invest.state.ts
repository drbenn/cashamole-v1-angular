import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { InvestActions } from './invest.actions';
import { Invest } from '../../model/core.model';
import { CoreApiService } from '../../shared/api/core-api.service';
import { DashboardActions } from '../dashboard/dashboard.actions';


export interface InvestStateModel {
    investments: Invest[]
}

@State<InvestStateModel>({
  name: 'invest',
  defaults: {
        investments: []
    },
  }
)
@Injectable()
export class InvestState {
  constructor(
    private store: Store,
    private router: Router,
    private coreApi: CoreApiService
    ) {}


  @Action(InvestActions.SetInvestOnLogin)
  setInvestOnLogin(
    ctx: StateContext<InvestStateModel>,
    action: InvestActions.SetInvestOnLogin
  ) {
    ctx.patchState({ 
      investments: action.payload
    });
  };

  @Action(InvestActions.GetAndSetMonthInvestRecords)
  getAndSetMonthInvestRecords(
    ctx: StateContext<InvestStateModel>,
    action: InvestActions.GetAndSetMonthInvestRecords
  ) {
    this.coreApi.getActiveInvestRecordsByMonth(action.payload).subscribe((res: any) => {
      if (res.data === 'null') {
        this.store.dispatch(new DashboardActions.UpdateMonthInvestTotal(null));
        ctx.patchState({ 
            investments: []
        });
      } else {
        const resData: Invest[] = JSON.parse(res.data)
        console.log('GET AND SET INVEST MONTH INVETS RECORDS');
        console.log(resData);
                
        this.store.dispatch(new DashboardActions.UpdateMonthInvestTotal(resData));
        ctx.patchState({ 
            investments: JSON.parse(res.data)
        });
      };
    });
  };

  @Action(InvestActions.AddInvest)
  addInvest(
    ctx: StateContext<InvestStateModel>,
    action: InvestActions.AddInvest
  ) {
    let updatedInvest: Invest[] = ctx.getState().investments;
    updatedInvest === null ? updatedInvest = [] : updatedInvest = updatedInvest; 
    updatedInvest.push(action.payload);
    this.store.dispatch(new DashboardActions.UpdateMonthInvestTotal(updatedInvest));
    ctx.patchState({ investments: updatedInvest });
  };

  @Action(InvestActions.EditInvestRecord)
  editUserInvestRecord(
      ctx: StateContext<InvestStateModel>,
      action: InvestActions.EditInvestRecord
  ) {
    if (typeof action.payload.date === 'string') {
      const dateObject: Date = new Date(action.payload.date);
      action.payload.date = dateObject
    };   
    const year: string = action.payload.date.getFullYear().toString();
    const month: string = (action.payload.date.getMonth() + 1).toString().padStart(2, '0');
    const yearMonthId: string = `${year}-${month}`;
    this.store.dispatch(new InvestActions.GetAndSetMonthInvestRecords(yearMonthId));
    // let currentInvestRecords: Invest[] = ctx.getState().invest;
    // currentInvestRecords === null ? currentInvestRecords = [] : currentInvestRecords = currentInvestRecords; 
    // const updatedInvestRecords: Invest[] = [];
    // currentInvestRecords.forEach((record: Invest) => {
    //   if (record.inc_id === action.payload.inc_id) {
    //     updatedInvestRecords.push(action.payload);
    //   } else {
    //     updatedInvestRecords.push(record);
    //   }
    // })
    // ctx.patchState({ invest: updatedInvestRecords });
  };

  @Action(InvestActions.DeactivateUserInvestRecord)
  deactivateUserInvestRecord(
      ctx: StateContext<InvestStateModel>,
      action: InvestActions.DeactivateUserInvestRecord
  ) {
      let currentInvestRecords: Invest[] = ctx.getState().investments;
      currentInvestRecords === null ? currentInvestRecords = [] : currentInvestRecords = currentInvestRecords; 
      const updatedInvestRecords: Invest[] = [];
      currentInvestRecords.forEach((record: Invest) => {
        if (record.inv_id !== action.payload.inv_id) {
          updatedInvestRecords.push(record);
        };
      });
      this.store.dispatch(new DashboardActions.UpdateMonthInvestTotal(updatedInvestRecords)); 
      ctx.patchState({ investments: updatedInvestRecords });
  };
}