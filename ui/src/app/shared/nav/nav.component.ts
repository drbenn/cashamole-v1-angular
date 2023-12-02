import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserApiService } from '../api/user-api.service';
import { Observable, first, take } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { UserStateModel } from '../../store/user/userState.state';
import { UserActions } from '../../store/user/userState.actions';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  private userApi = inject(UserApiService);
  @Select((state: {user: UserStateModel}) => state.user.loggedInUser.username)
    loggedInUser$! : Observable<string>;

  public loggedInUserVal!: string;
  
  constructor(
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
      this.loggedInUser$.subscribe((username:string) => {
        this.loggedInUserVal = username;
      });
  };

  protected navigateHome() {
    this.router.navigate(['home']);
  };

  protected logoutUser(navToSplash: boolean): void {
    this.userApi.logoutUser().pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          this.store.dispatch(new UserActions.ClearUserStateOnLogout());
          if (navToSplash) {
            this.router.navigate(['splash']);
          }
        },
        error: (error: any) => {
          console.log(error);
          
        }
      }
    );
  }
}
