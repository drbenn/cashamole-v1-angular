import { Component, OnInit } from '@angular/core';
import { DashboardState } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '../dashboard.service';
import { DashboardHistoryExpense } from '../../models/core.model';
import { BarChartDataInputs } from '../../models/dashboard.models';


@Component({
  selector: 'app-expense-composition',
  standalone: true,
  imports: [CardModule, ChartModule],
  templateUrl: './expense-composition.component.html',
  styleUrl: './expense-composition.component.scss'
})
export class ExpenseCompositionComponent implements OnInit {
  @Select(DashboardState.expenseCompositionChartData) data$!: Observable<{ userView: string, data: DashboardHistoryExpense[]}>;
  protected chartData: any;
  protected chartOptions: any;

  constructor(
    private dashboardService: DashboardService
  ) {};

  ngOnInit(): void {
    this.data$.subscribe((data: { userView: string, data: DashboardHistoryExpense[]}) => {
      if (data) {

        if (data.userView === 'annual' ||  data.userView === 'all-time' || data.userView === 'monthly') {
          const annualExpenses: BarChartDataInputs  = this.configureExpenseDataInputsIntoCategories(data.data);
          this.updateChart(annualExpenses);
        };
      };
    });
  };

  private updateChart(data: BarChartDataInputs) {
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

  private configureExpenseDataInputsIntoCategories(data: DashboardHistoryExpense[]) {
    // get unique categories
    const categories: string[] = Array.from(
      new Set(
        data.map((item: DashboardHistoryExpense) => item.category)
    ));
    categories.sort();

    // get colors
    const backgroundColors: string[] = this.dashboardService.chartTransparentColors(categories.length);
    const borderColors: string[] = this.dashboardService.chartOpaqueColors(categories.length);

    // get data
    const categoryData: number[] = new Array(categories.length).fill(0);
    data.forEach((item: DashboardHistoryExpense) => {
      const categoryIndex: number = categories.findIndex((category: string) => category === item.category);
      categoryData[categoryIndex] += parseFloat(item.total_expense);
    });

    return {
      chartDataSet: categoryData,
      labels: categories,
      backgroundColors: backgroundColors,
      borderColors: borderColors
    };
  };


}

