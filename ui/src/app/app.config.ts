import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule } from 'primeng/chart';
import { AppState } from './store/appState.state';
import { UserState } from './store/user/userState.state';
import { ChipState } from './store/chip/chipState.state';
import { BalanceSheetState } from './store/balanceSheet/bsState.state';
import { ExpenseState } from './store/expense/expense.state';
import { CalendarState } from './store/calendar/calendar.state';
import { DashboardState } from './store/dashboard/dashboard.state';
import { InvestState } from './store/invest/invest.state';
import { IncomeState } from './store/income/income.state';



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      NgxsModule.forRoot(
        [AppState, UserState, ChipState, BalanceSheetState, IncomeState, ExpenseState, CalendarState, DashboardState, InvestState]
      ),
      // devtools always last
      NgxsReduxDevtoolsPluginModule.forRoot(),
      CookieService,
      BrowserAnimationsModule,
      ChartModule
    )
  ]

};
