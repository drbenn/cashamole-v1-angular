import { Component, OnInit } from '@angular/core';
import { DashboardStateModel } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ChartModule } from 'primeng/chart';
import { ExpenseStateModel } from '../../store/expense/expense.state';

@Component({
  selector: 'app-expense-history',
  standalone: true,
  imports: [CardModule, ChartModule],
  templateUrl: './expense-history.component.html',
  styleUrl: './expense-history.component.scss'
})
export class ExpenseHistoryComponent implements OnInit {
  protected dashboardData$: Observable<any> = this.store.select((state: any) => state.dashboard);
  protected expenseData$: Observable<any> = this.store.select((state: any) => state.expense);
  protected chartData: any;
  protected chartOptions: any;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.expenseData$.subscribe((data: ExpenseStateModel) => {
      // console.log(data);
    })
      
    this.dashboardData$.subscribe((data: DashboardStateModel) => {
      // console.log(data);
      this.chartData = {
        labels: ['Nov', 'Dec', 'Jan'],
        datasets: [
          {
            label: false,
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

    })
  }
}

