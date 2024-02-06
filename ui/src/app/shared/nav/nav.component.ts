import { Component, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserApiService } from '../../api-services/user-api.service';
import { Observable, filter, first, take } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { UserStateModel } from '../../store/user/userState.state';
import { UserActions } from '../../store/user/userState.actions';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { CalendarStateModel } from '../../store/calendar/calendar.state';
import { CalendarActions } from '../../store/calendar/calendar.actions';
import { DateRange } from '../../models/calendar.model';
import {Sidebar, SidebarModule} from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, CalendarModule, FormsModule, SidebarModule, MenuModule, DividerModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  @Select((state: {user: UserStateModel }) => state.user.loggedInUser.username) loggedInUser$! : Observable<string>;
  @Select((state: {calendar: CalendarStateModel }) => state.calendar.monthDateRange) monthDateRange$!: Observable<any>;
  public loggedInUserVal!: string;
  protected monthDate!: Date;
  protected isMobileView: boolean = false;
  protected visibleSidebar!: boolean;
  private MOBILE_VIEW_WINDOW_SIZE: number = 1000;
  protected isHiddenForDashboard: boolean = false;

  protected items: MenuItem[] = [
    {
      label: 'Profile Settings',
      icon: 'pi pi-cog',
      command: () => {
        this.userSettingsAlert();
      }
  },
  { separator: true },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => {
      this.logoutUser(true);
    }
  }
    // { label: 'Angular.io', icon: 'pi pi-info', url: 'http://angular.io' },
    // { separator: true },
    // { label: 'Installation', icon: 'pi pi-cog', routerLink: ['/installation'] }
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const width = event.target.innerWidth;
    if (width && width < this.MOBILE_VIEW_WINDOW_SIZE ) {
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    };
  };
  
  constructor(
    private router: Router,
    private store: Store,
    private userApi: UserApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (window.innerWidth < this.MOBILE_VIEW_WINDOW_SIZE) {
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    };

    this.monthDate = new Date();
    this.loggedInUser$.subscribe((username:string) => {
      this.loggedInUserVal = username;
    });

    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      const currentUrl = event.url;
      // Perform actions based on the new path
      // this.updateNavbar(currentUrl);
      currentUrl === '/home' ? this.isHiddenForDashboard = true : this.isHiddenForDashboard = false;
    });
  };

  protected userSettingsAlert(): void {
    alert('User profile settings under construction')
  };

  protected closeCallback(e: any): void {
    this.sidebarRef.close(e);
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
            this.router.navigate(['login']);
          }
        },
        error: (error: Error) => {
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

    const activeMonth: string = firstDayOfSelectedMonth.toLocaleString(undefined, { month: 'short' });
    const fullyear: string = firstDayOfSelectedMonth.getFullYear().toString();
  };
}
