import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DashboardState, DashboardStateModel } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-month-cash-flow-summary',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './month-cash-flow-summary.component.html',
  styleUrl: './month-cash-flow-summary.component.scss'
})
export class MonthCashFlowSummaryComponent implements OnInit {
  @Select(DashboardState.monthCashFlowSummary) dashboardData$!: Observable<any>;
  protected monthIncome: number = 0;
  protected monthExpense: number = 0;
  protected monthNetCashflow: number = 0;

  constructor() {}

  ngOnInit(): void {
      this.dashboardData$.subscribe((data: DashboardStateModel) => {
        this.monthIncome = data.monthIncome;
        this.monthExpense = data.monthExpenses;
        this.monthNetCashflow = data.monthNetCashFlow;
      })
  }
}