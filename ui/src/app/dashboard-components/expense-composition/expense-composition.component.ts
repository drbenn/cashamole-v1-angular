import { Component, OnInit } from '@angular/core';
import { DashboardStateModel } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ChartModule } from 'primeng/chart';
import { DashboardColorsService } from '../dashboard-colors.service';


@Component({
  selector: 'app-expense-composition',
  standalone: true,
  imports: [CardModule, ChartModule],
  templateUrl: './expense-composition.component.html',
  styleUrl: './expense-composition.component.scss'
})
export class ExpenseCompositionComponent implements OnInit {
  protected dashboardData$: Observable<any> = this.store.select((state: any) => state.dashboard);
  protected chartData: any;
  protected chartOptions: any;

  constructor(
    private store: Store,
    private dashboardColorService: DashboardColorsService
    ) {}

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dashboardData$.subscribe((data: DashboardStateModel) => {
      // console.log(data);
      this.chartData = {
        labels: ['Discretionary', 'Groceries', 'Recurring'],
        datasets: [
          {
            data: [data.monthExpenses, data.monthIncome, data.monthInvest],
            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)'],
            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
            borderWidth: 1,
            hoverBackgroundColor: ['salmon', 'lime', 'teal']     
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
    })
  }
}
