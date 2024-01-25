import { Component, OnInit } from '@angular/core';
import { DashboardState, DashboardStateModel } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ChartModule } from 'primeng/chart';
import { ExpenseStateModel } from '../../store/expense/expense.state';
import { DashboardHistoryIncome, Income } from '../../models/core.model';
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

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.data$.subscribe((data: { userView: string, data: DashboardHistoryIncome[] }) => {
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

  // private configureDataInputsForAnnual(data: DashboardHistoryIncome[]): BarChartDataInputs {
  //   const chartDataSet: number[] = this.sumDataIntoMonthBaskets(data);
  //   const labels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  //   const backgroundColors: string[] = this.dashboardService.chartTransparentColors(chartDataSet.length);
  //   const borderColors: string[] = this.dashboardService.chartTransparentColors(chartDataSet.length);
  //   return {
  //     chartDataSet: chartDataSet,
  //     labels: labels,
  //     backgroundColors: backgroundColors,
  //     borderColors: borderColors
  //   };
  // };

  // private configureDataInputsForAllTime(data: DashboardHistoryIncome[]): BarChartDataInputs {
  //   // get unique years for filter
  //   const dataYears: string[] = Array.from(
  //     new Set(
  //       data.map((item: DashboardHistoryIncome) => item.unique_date.slice(0, 4))
  //   ));
  //   dataYears.sort();

  //   const chartDataSet: number[] = this.sumDataIntoYearBaskets(data, dataYears);
  //   const labels: string[] = dataYears;
  //   const backgroundColors: string[] = this.dashboardService.chartTransparentColors(dataYears.length);
  //   const borderColors: string[] = this.dashboardService.chartTransparentColors(dataYears.length);
  //   return {
  //     chartDataSet: chartDataSet,
  //     labels: labels,
  //     backgroundColors: backgroundColors,
  //     borderColors: borderColors
  //   };
  // };

  // private sumDataIntoMonthBaskets(data: DashboardHistoryIncome[]): number[] {
  //   const twelveMonthsData: number[] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  //   data.forEach((item: DashboardHistoryIncome) => {
  //     const month: number = parseInt(item.unique_date.slice(5,8));
  //     const amount: number = parseFloat(item.total_income);
  //     twelveMonthsData[month - 1] = twelveMonthsData[month - 1] + amount;
  //   });
  //   return twelveMonthsData;
  // };

  // private sumDataIntoYearBaskets(data: DashboardHistoryIncome[], dataYears: string[]): number[] {
  //   const xYearData: number[] = new Array(dataYears.length).fill(0);
  //   data.forEach((item: DashboardHistoryIncome) => {
  //     const year: number = parseInt(item.unique_date.slice(0,4));
  //     const amount: number = parseFloat(item.total_income);
  //     const itemIndex: number = dataYears.findIndex((_year: string) => _year === year.toString());
  //     xYearData[itemIndex] = xYearData[itemIndex] + amount;
  //   });
  //   return xYearData;
  // };
}


