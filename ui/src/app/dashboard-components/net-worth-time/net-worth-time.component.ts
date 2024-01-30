import { Component, OnInit } from '@angular/core';
import { DashboardState, DashboardStateModel } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';
import { Observable, last } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ChartModule } from 'primeng/chart';
import { ExpenseStateModel } from '../../store/expense/expense.state';
import { CommonModule } from '@angular/common';
import { DashboardHistoryBalance, DashboardHistoryNetWorth } from '../../models/core.model';
import { DashboardService } from '../dashboard.service';
import { BarChartDataInputs } from '../../models/dashboard.models';

@Component({
  selector: 'app-net-worth-time',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule],
  templateUrl: './net-worth-time.component.html',
  styleUrl: './net-worth-time.component.scss'
})
export class NetWorthTimeComponent implements OnInit {
  @Select(DashboardState.netWorthHistoryChartData) data$!: Observable<{ userView: string, data: DashboardHistoryNetWorth[] }>;
  protected chartData: any;
  protected chartOptions: any;
  protected userView!: string;

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.data$.subscribe((data: { userView: string, data: DashboardHistoryNetWorth[] }) => {
      this.userView = data.userView;
      if (data.userView === 'monthly') {
        const annualChartData: BarChartDataInputs  = this.dashboardService.configureDataInputsForMonthly(data.data);
        this.updateChart(annualChartData);
      }
      if (data.userView === 'annual') {
        const annualChartData: BarChartDataInputs  = this.dashboardService.configureDataInputsForAnnual(data.data);
        this.updateChart(annualChartData);
      }
      if (data.userView=== 'all-time') {
        const allTimeChartData: BarChartDataInputs  = this.dashboardService.configureDataInputsForAllTime(data.data);
        this.updateChart(allTimeChartData);
      }
    });
  };


  private updateChart(data: BarChartDataInputs) {
    this.chartData = {
      labels: data.labels,
      datasets: [
        {
          label: false,
          data: data.chartDataSet,
          backgroundColor: data.backgroundColors,
          borderColor: data.borderColors,
          borderWidth: 1,
          hoverBackgroundColor: ['#9ce0c1']
        }
      ]
    };
    this.chartOptions = {
      plugins: {
        legend: {
            display: false,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#00000090'
          },
          grid: {
            color: '#00000010',
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: '#00000095'
          },
          grid: {
            color: '#00000000',
            drawBorder: false
          }
        }
      }
    };
  };

}
