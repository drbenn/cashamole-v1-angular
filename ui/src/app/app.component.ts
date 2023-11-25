import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./common/nav/nav.component";
import { FooterComponent } from './common/footer/footer.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, NavComponent, FooterComponent]
})
export class AppComponent {
  title = 'ui';
}
