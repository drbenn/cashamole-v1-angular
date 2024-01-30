import { Component, OnInit } from '@angular/core';
import { DashboardState } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { ChartModule } from 'primeng/chart';
import { DashboardHistoryIncome } from '../../models/core.model';
import { DashboardService } from '../dashboard.service';
import { BarChartDataInputs } from '../../models/dashboard.models';


@Component({
  selector: 'app-income-history',
  standalone: true,
  imports: [CardModule, ChartModule],
  templateUrl: './income-history.component.html',
  styleUrl: './income-history.component.scss'
})
export class IncomeHistoryComponent implements OnInit {
  @Select(DashboardState.incomeHistoryChartData) data$!: Observable<{ userView: string, data: DashboardHistoryIncome[] }>;
  protected chartData: any;
  protected chartOptions: any;
  protected userView!: string;

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.data$.subscribe((data: { userView: string, data: DashboardHistoryIncome[] }) => {
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


