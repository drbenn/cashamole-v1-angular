import { Component, OnInit } from '@angular/core';
import { DashboardState } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '../dashboard.service';
import { DashboardHistoryInvestment } from '../../models/core.model';
import { ChartJsDataInputs } from '../../models/dashboard.models';

@Component({
  selector: 'app-invest-composition',
  standalone: true,
  imports: [CardModule, ChartModule],
  templateUrl: './invest-composition.component.html',
  styleUrl: './invest-composition.component.scss'
})
export class InvestCompositionComponent implements OnInit {
  @Select(DashboardState.investCompositionChartData) data$!: Observable<{ userView: string, data: DashboardHistoryInvestment[]}>;
  protected chartData: any;
  protected chartOptions: any;

  constructor(
    private dashboardService: DashboardService
  ) {};

  ngOnInit(): void {
    this.data$.subscribe((data: { userView: string, data: DashboardHistoryInvestment[]}) => {
      if (data) {
        if (data.userView === 'annual' ||  data.userView === 'all-time' || data.userView === 'monthly') {
          const chartInvestments: ChartJsDataInputs  = this.configureInvestDataInputsIntoCategories(data.data);
          this.updateChart(chartInvestments);
        };
      };
    });
  };

  private updateChart(data: ChartJsDataInputs) {
    this.chartData = {
      labels: data.labels,
      datasets: [
        {
          data: data.chartDataSet,
          backgroundColor: data.backgroundColors,
          borderColor: data.borderColors,
          borderWidth: 1,
          hoverBackgroundColor: data.borderColors     
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
            position: 'left',
            labels: {
                color: '#00000090',
                position: 'left'
            }
        }
      }
    };
  };

  private configureInvestDataInputsIntoCategories(data: DashboardHistoryInvestment[]) {
    // get unique categories
    const categories: string[] = Array.from(
      new Set(
        data.map((item: DashboardHistoryInvestment) => item.institution)
    ));
    categories.sort();

    // get colors
    const backgroundColors: string[] = this.dashboardService.chartTransparentColors(categories.length);
    const borderColors: string[] = this.dashboardService.chartOpaqueColors(categories.length);

    // get data
    const categoryData: number[] = new Array(categories.length).fill(0);
    data.forEach((item: DashboardHistoryInvestment) => {
      const categoryIndex: number = categories.findIndex((institution: string) => institution === item.institution);
      categoryData[categoryIndex] += parseFloat(item.total_invest);
    });

    return {
      chartDataSet: categoryData,
      labels: categories,
      backgroundColors: backgroundColors,
      borderColors: borderColors
    };
  };


}