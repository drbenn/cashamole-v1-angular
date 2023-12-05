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

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      NgxsModule.forRoot(
        [AppState, UserState, ChipState]
      ),
      // devtools always last
      NgxsReduxDevtoolsPluginModule.forRoot()
    )
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
