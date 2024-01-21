import { Component, OnInit } from '@angular/core';
import { DashboardStateModel } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ChartModule } from 'primeng/chart';
import { ExpenseStateModel } from '../../store/expense/expense.state';

@Component({
  selector: 'app-net-cash-flow-time',
  standalone: true,
  imports: [CardModule, ChartModule],
  templateUrl: './net-cash-flow-time.component.html',
  styleUrl: './net-cash-flow-time.component.scss'
})
export class NetCashFlowTimeComponent implements OnInit {
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
        labels: ['Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [
          {
            label: 'Monthly Cash Flow',
            data: [1500, 2200, -500, 1600, -1500, 1200],
            borderColor: ['rgb(54, 162, 235)'],
            borderWidth: 2,
            tension: 0.3
          },
          {
            // label: 'Net Liaibilities',
            data: [0, 0, 0, 0, 0, 0],
            borderColor: ['rgb(255, 64, 64)'],
            borderWidth: 1,
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