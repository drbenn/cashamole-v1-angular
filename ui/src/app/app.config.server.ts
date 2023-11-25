import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { AppState } from './store/appState.state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { UserState } from './store/user/userState.state';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      NgxsModule.forRoot(
        [AppState, UserState]
      ),
      // devtools always last
      NgxsReduxDevtoolsPluginModule.forRoot()
    )
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
