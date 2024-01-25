import { Component, OnInit } from '@angular/core';
import { DashboardState } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
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
          const annualExpenses: BarChartDataInputs  = this.configureExpenseDataInputsForAllTime(data.data);
          this.updateChart(annualExpenses);
        };
        // if (data.userView=== 'all-time') {
        //   const alltimeExpenses: BarChartDataInputs  = this.configureExpenseDataInputsForAllTime(data.data);
        //   this.updateChart(alltimeExpenses);
        // };
        // if (data.userView=== 'monthly') {        
        //   const monthlyExpenses: BarChartDataInputs  = this.configureBalanceDataInputsForAnnual(assets);
        //   this.updateChart(monthlyExpenses);
        // };
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

  private configureExpenseDataInputsForAllTime(data: DashboardHistoryExpense[]) {
    const today = new Date();
    const todayMonth: string = today.toLocaleDateString('en-US', { month: '2-digit' });
    const todayFullYear: string = today.getFullYear().toString();
    console.log(todayMonth, todayFullYear);
    
    const dataToToday: DashboardHistoryExpense[] = data.filter((_data: DashboardHistoryExpense) => _data.unique_date.slice(0, 4) <= todayFullYear && _data.unique_date.slice(5, 7) <= todayMonth);
    console.log(dataToToday);
    
    // get unique categories
    const categories: string[] = Array.from(
      new Set(
        dataToToday.map((item: DashboardHistoryExpense) => item.category)
    ));
    categories.sort();

    // get colors
    const backgroundColors: string[] = this.dashboardService.chartTransparentColors(categories.length);
    const borderColors: string[] = this.dashboardService.chartOpaqueColors(categories.length);

    // get data
    const categoryData: number[] = new Array(categories.length).fill(0);
    dataToToday.forEach((item: DashboardHistoryExpense) => {
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

  private configureExpenseDataInputsForAnnual(data: DashboardHistoryExpense[]) {
    // // get unique categories
    // const categories: string[] = Array.from(
    //   new Set(
    //     data.map((item: DashboardHistoryExpense) => item.category)
    // ));
    // categories.sort();

    // // get colors
    // const backgroundColors: string[] = this.dashboardService.chartTransparentColors(categories.length);
    // const borderColors: string[] = this.dashboardService.chartOpaqueColors(categories.length);

    // // get data
    // const categoryData: number[] = new Array(categories.length).fill(0);
    // data.forEach((item: DashboardHistoryExpense) => {
    //   const categoryIndex: number = categories.findIndex((category: string) => category === item.category);
    //   categoryData[categoryIndex] += parseFloat(item.total_expense);
    // });

    // return {
    //   chartDataSet: categoryData,
    //   labels: categories,
    //   backgroundColors: backgroundColors,
    //   borderColors: borderColors
    // };
  };

}
//   protected dashboardData$: Observable<any> = this.store.select((state: any) => state.dashboard);
//   protected chartData: any;
//   protected chartOptions: any;

//   constructor(
//     private store: Store,
//     private dashboardColorService: DashboardService
//     ) {}

//   ngOnInit(): void {
//     const documentStyle = getComputedStyle(document.documentElement);
//     const textColor = documentStyle.getPropertyValue('--text-color');

//     this.dashboardData$.subscribe((data: DashboardStateModel) => {
//       // console.log(data);
//       this.chartData = {
//         labels: ['Discretionary', 'Groceries', 'Recurring'],
//         datasets: [
//           {
//             data: [data.monthExpenses, data.monthIncome, data.monthInvest],
//             backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)'],
//             borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
//             borderWidth: 1,
//             hoverBackgroundColor: ['salmon', 'lime', 'teal']     
//           }
//         ]
//       };
  
//       this.chartOptions = {
//         plugins: {
//           legend: {
//               position: 'left',
//               labels: {
//                   color: '#00000090',
//                   position: 'left'
//               }
//           }
//         }
//       };
//     })
//   }
// }
