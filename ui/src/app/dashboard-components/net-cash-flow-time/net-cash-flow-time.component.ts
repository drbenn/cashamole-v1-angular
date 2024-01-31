import { Component, OnInit } from '@angular/core';
import { DashboardState } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '../dashboard.service';
import { ChartJsDataInputs } from '../../models/dashboard.models';
import { DashboardHistoryCashFlow } from '../../models/core.model';

@Component({
  selector: 'app-net-cash-flow-time',
  standalone: true,
  imports: [CardModule, ChartModule],
  templateUrl: './net-cash-flow-time.component.html',
  styleUrl: './net-cash-flow-time.component.scss'
})
export class NetCashFlowTimeComponent implements OnInit {
  @Select(DashboardState.netCashFlowChartData) data$!: Observable<{ userView: string, data: DashboardHistoryCashFlow[] }>;
  protected chartData: any;
  protected chartOptions: any;
  protected userView!: string;

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.data$.subscribe((data: { userView: string, data: DashboardHistoryCashFlow[] }) => {
      this.userView = data.userView;

      if (data.userView === 'monthly') {
        const monthlyNetWorthChartData: ChartJsDataInputs  = this.dashboardService.configureDataInputsForMonthly(data.data);
        this.updateChart(monthlyNetWorthChartData);
      } else if (data.userView === 'annual') {
        const annualNetWorthChartData: ChartJsDataInputs  = this.dashboardService.configureDataInputsForAnnual(data.data);
        this.updateChart(annualNetWorthChartData);
      } else if (data.userView=== 'all-time') {
        const allTimeNetWorthChartData: ChartJsDataInputs  = this.dashboardService.configureDataInputsForAllTime(data.data);
        this.updateChart(allTimeNetWorthChartData);
      };
    });
  };

  private updateChart(data: ChartJsDataInputs) {
    this.chartData = {
      labels: data.labels,
      datasets: [
        {
          label: 'Net Cash Flow',
          data: data.chartDataSet,
          backgroundColor: [data.backgroundColors[0]],
          borderColor: [data.borderColors[0]],
          hoverBackgroundColor: [data.borderColors[0]],
          borderWidth: 2,
          tension: 0.3
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
