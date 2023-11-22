import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserApiService } from '../../shared/api/user-api.service';
import { first, take } from 'rxjs';

@Component({
  selector: 'app-how-to',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-to.component.html',
  styleUrl: './how-to.component.scss'
})
export class HowToComponent {

  constructor(private userApi: UserApiService) {}

  allUsers: any;
  hello: any;
  pub: any;

  getHello() {
    this.userApi.getHello().pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          console.log(value);
          this.hello = value;
        },
        error: (error: any) => {
          console.error(error);
        }
      }
    )
  }

  getPub() {
    this.userApi.getPub().pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          console.log(value);
          this.pub = value;
        },
        error: (error: any) => {
          console.error(error);
        }
      }
    )
  }

  getLogin() {
    this.userApi.getLogin().pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          console.log(value);
          this.hello = value;
        },
        error: (error: any) => {
          console.error(error);
        }
      }
    )
  }

  getLogout() {
    this.userApi.getLogout().pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          console.log(value);
          this.hello = value;
        },
        error: (error: any) => {
          console.error(error);
        }
      }
    )
  }

  getAllUsers() {
    this.userApi.getAllUsers().pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          console.log(value);
          this.allUsers = value;
        },
        error: (error: any) => {
          console.error(error);
        }
      }
    )
  }

}


