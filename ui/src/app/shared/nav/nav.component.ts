import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserApiService } from '../api/user-api.service';
import { Observable, first, take } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { UserStateModel } from '../../store/user/userState.state';
import { UserActions } from '../../store/user/userState.actions';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { CalendarStateModel } from '../../store/calendar/calendar.state';
import { CalendarActions } from '../../store/calendar/calendar.actions';
import { DateRange } from '../../model/calendar.model';
import {SidebarModule} from 'primeng/sidebar';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, CalendarModule, FormsModule, SidebarModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  @Select((state: {user: UserStateModel }) => state.user.loggedInUser.username) loggedInUser$! : Observable<string>;
  @Select((state: {calendar: CalendarStateModel }) => state.calendar.monthDateRange) monthDateRange$!: Observable<any>;
  public loggedInUserVal!: string;
  monthDate!: Date;
  protected isMobileView: boolean = false;
  protected visibleSidebar!: boolean;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const width = event.target.innerWidth;
    if (width && width < 700 ) {
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    };
  };
  
  constructor(
    private router: Router,
    private store: Store,
    private userApi: UserApiService
  ) {}

  ngOnInit(): void {
    if (window.innerWidth < 700) {
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    };

    this.monthDate = new Date();
    this.loggedInUser$.subscribe((username:string) => {
      this.loggedInUserVal = username;
    });
  };

  protected sidebarClose(): void {
    this.visibleSidebar = false; 
  };

  protected navigateHome(): void {
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
  };

  protected backOneMonth(): void {
    let previousMonth: Date = this.monthDate;
    previousMonth.setMonth(previousMonth.getMonth() - 1);   
    this.monthDate = previousMonth;
    this.updateCalendarDisplay();
    this.updateActiveMonthRange(previousMonth);
  };

  protected forwardOneMonth(): void {
    let nextMonth: Date = this.monthDate;
    nextMonth.setMonth(nextMonth.getMonth() + 1);   
    this.monthDate = nextMonth;
    this.updateCalendarDisplay();
    this.updateActiveMonthRange(nextMonth);
  };

  private updateCalendarDisplay(): void {
    // Force the calendar to update its display
    // This is necessary because manually changing the 'monthDate' does not trigger the 'onSelect' event
    setTimeout(() => {
      this.monthDate = new Date(this.monthDate);
    }, 0);
  };

  protected updateActiveMonthRange(event: any): void {
    const firstDayOfSelectedMonth: Date = event;
    const monthDateRange: DateRange = {
      startDate: new Date(firstDayOfSelectedMonth.getFullYear(), firstDayOfSelectedMonth.getMonth(), 1),
      endDate: new Date(firstDayOfSelectedMonth.getFullYear(), firstDayOfSelectedMonth.getMonth() + 1, 0)
    };
    this.store.dispatch(new CalendarActions.ChangeCalendarMonth(monthDateRange));
  };
}
