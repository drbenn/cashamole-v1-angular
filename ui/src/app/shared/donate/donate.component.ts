import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { User } from '../../model/user.models';
import { UserStateModel } from '../../store/user/userState.state';
import { UserActions } from '../../store/user/userState.actions';


@Component({
  selector: 'app-donate',
  standalone: true,
  imports: [CommonModule],
  providers: [],
  templateUrl: './donate.component.html',
  styleUrl: './donate.component.scss'
})
export class DonateComponent implements OnInit {

  @Select((state: {user: UserStateModel}) => state.user.loggedInUser) 
    loggedInUser$! : Observable<User>;

  public loggedInUserVal!: User;

  constructor(private store: Store) {}

  ngOnInit(): void {
      this.loggedInUser$.subscribe(user => this.loggedInUserVal = user)
  }

  loginState(): void {
    this.store.dispatch(new UserActions.RegisterLoggedInUser({username: 'frank', email: 'frank@xyz.com'}));
  }
}
