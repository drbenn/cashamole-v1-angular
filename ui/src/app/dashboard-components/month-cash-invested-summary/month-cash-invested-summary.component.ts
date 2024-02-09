import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DashboardState, DashboardStateModel } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-month-cash-invested-summary',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './month-cash-invested-summary.component.html',
  styleUrl: './month-cash-invested-summary.component.scss'
})
export class MonthCashInvestedSummaryComponent implements OnInit {
  @Select(DashboardState.monthCashInvestedSummary) dashboardData$!: Observable<any>;
  protected monthIncome: number = 0;
  protected monthPretaxInvest: number = 0;
  protected monthPosttaxInvest: number = 0;
  protected monthTotalInvest: number = 0;
  protected monthInvestmentsAsPercentOfCashflow: number = 0;

  constructor() {}

  ngOnInit(): void {
      this.dashboardData$.subscribe((data: DashboardStateModel) => {
        this.monthIncome = data.monthIncome;
        this.monthPretaxInvest = data.monthPreTaxInvest;
        this.monthPosttaxInvest = data.monthPostTaxInvest;
        this.monthTotalInvest = data.monthInvest;
        if (this.monthPretaxInvest > 0 ) {
          this.monthInvestmentsAsPercentOfCashflow = ( (data.monthPreTaxInvest + data.monthPostTaxInvest) / (data.monthIncome + data.monthPreTaxInvest) );
        } else {
          this.monthInvestmentsAsPercentOfCashflow = ( data.monthPostTaxInvest / data.monthIncome ) ;
        };
      });
  };
  
}