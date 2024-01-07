import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './shared/nav/nav.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CoreApiService } from './shared/api/core-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ui';

  constructor(private coreApi: CoreApiService) {}

  ngOnInit(): void {
    this.coreApi.verifyApiConnection().subscribe(
      {
        next: (value: any) => {
          console.log('app on init data response from verifyApiConnection');
          console.log(value.message);
        },
        error: (error: any) => {
          console.log('app on init ERROR response from verifyApiConnection');
          console.error(error)
        }
      }
    )
  }
}
