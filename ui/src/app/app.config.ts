import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { AppState } from './store/appState.state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { UserState } from './store/user/userState.state';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule } from 'primeng/chart';
import { ChipState } from './store/chip/chipState.state';
import { BalanceSheetState } from './store/balanceSheet/bsState.state';
import { IncomeState } from './store/income/income.state';
import { ExpenseState } from './store/expense/expense.state';
import { CalendarState } from './store/calendar/calendar.state';
import { DashboardState } from './store/dashboard/dashboard.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    importProvidersFrom(
      NgxsModule.forRoot(
        [AppState, UserState, ChipState, BalanceSheetState, IncomeState, ExpenseState, CalendarState, DashboardState]
      ),
      // devtools always last
      NgxsReduxDevtoolsPluginModule.forRoot(),
      CookieService,
      BrowserAnimationsModule,
      ChartModule
    )
  ]
};
