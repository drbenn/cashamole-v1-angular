import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DashboardState, DashboardStateModel } from '../../store/dashboard/dashboard.state';
import { Select } from '@ngxs/store';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-month-net-worth-summary',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './month-net-worth-summary.component.html',
  styleUrl: './month-net-worth-summary.component.scss'
})
export class MonthNetWorthSummaryComponent implements OnInit {
  @Select(DashboardState.monthNetWorthSummary) dashboardData$!: Observable<any>;
  protected monthAssets: number = 0;
  protected monthLiabilities: number = 0;
  protected monthNetWorth: number = 0;

  constructor() {}

  ngOnInit(): void {
      this.dashboardData$.subscribe((data: DashboardStateModel) => {
        this.monthAssets = data.monthAssets;
        this.monthLiabilities = data.monthLiabilities;
        this.monthNetWorth = data.monthNetWorth;
      })
  }
}
