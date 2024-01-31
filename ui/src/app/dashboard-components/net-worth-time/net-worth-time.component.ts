import { Component, OnInit } from '@angular/core';
import { DashboardState } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { DashboardHistoryNetWorth } from '../../models/core.model';
import { DashboardService } from '../dashboard.service';
import { ChartJsDataInputs } from '../../models/dashboard.models';

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
        const annualChartData: ChartJsDataInputs  = this.dashboardService.configureDataInputsForMonthly(data.data);
        this.updateChart(annualChartData);
      } else if (data.userView === 'annual') {
        const annualChartData: ChartJsDataInputs  = this.dashboardService.configureDataInputsForAnnual(data.data);
        this.updateChart(annualChartData);
      } else if (data.userView=== 'all-time') {
        const allTimeChartData: ChartJsDataInputs  = this.dashboardService.configureDataInputsForAllTime(data.data);
        this.updateChart(allTimeChartData);
      };
    });
  };

  private updateChart(data: ChartJsDataInputs) {
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
