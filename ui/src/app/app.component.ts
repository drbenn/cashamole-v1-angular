import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './shared/nav/nav.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CoreApiService } from './api-services/core-api.service';
import { UserApiService } from './api-services/user-api.service';
import { Store } from '@ngxs/store';
import { UserActions } from './store/user/userState.actions';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ui';

  constructor(
    private coreApi: CoreApiService,
    private userApi: UserApiService ,
    private store: Store,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.coreApi.verifyApiConnection().subscribe(
      {
        next: (value: any) => {
          console.log('API connection successful!');
          const userIdCookie: number = <number><unknown>this.cookieService.get('cashamole_uid');
          this.userApi.loginCachedUser(userIdCookie)
          this.store.dispatch(new UserActions.TriggerUserCookieCheck);            
        },
        error: (error: Error) => {
          console.log('API connection failed!');
          console.error(error)
        }
      }
    )
  }
}
