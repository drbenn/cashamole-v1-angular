import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppState } from '../store/appState.state';
import { Store } from '@ngxs/store';
import { Increment } from '../store/appState.actions';


@Component({
  selector: 'app-donate',
  standalone: true,
  imports: [CommonModule],
  providers: [],
  templateUrl: './donate.component.html',
  styleUrl: './donate.component.scss'
})
export class DonateComponent {
  // counter$ = this.store.select<AppState>(AppState);

  // constructor(private store: Store) {}

  // increment(): void {
  //   this.store.dispatch(new Increment());
  // }
}
