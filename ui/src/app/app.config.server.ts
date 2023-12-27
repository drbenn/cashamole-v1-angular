import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { AppState } from './store/appState.state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { UserState } from './store/user/userState.state';
import { ChartModule } from 'primeng/chart';
import { ChipState } from './store/chip/chipState.state';
import { BalanceSheetState } from './store/balanceSheet/bsState.state';
import { IncomeState } from './store/income/income.state';
import { ExpenseState } from './store/expense/expense.state';
import { CalendarState } from './store/calendar/calendar.state';
import { DashboardState } from './store/dashboard/dashboard.state';
import { InvestState } from './store/invest/invest.state';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      NgxsModule.forRoot(
        [AppState, UserState, ChipState, BalanceSheetState, IncomeState, ExpenseState, CalendarState, DashboardState, InvestState]
      ),
      // devtools always last
      NgxsReduxDevtoolsPluginModule.forRoot(),
      ChartModule
    )
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
