import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserApiService } from '../../shared/api/user-api.service';
import { first, take } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  private userApi = inject(UserApiService)

  protected logoutUser(): void {
    this.userApi.logoutUser().pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          console.log('values');
          console.log(value);
          
        },
        error: (error: any) => {
          console.error(error)
        }
      }
    )
  }
}
