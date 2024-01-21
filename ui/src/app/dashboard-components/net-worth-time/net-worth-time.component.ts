import { Component, OnInit } from '@angular/core';
import { DashboardStateModel } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ChartModule } from 'primeng/chart';
import { ExpenseStateModel } from '../../store/expense/expense.state';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-net-worth-time',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule],
  templateUrl: './net-worth-time.component.html',
  styleUrl: './net-worth-time.component.scss'
})
export class NetWorthTimeComponent implements OnInit {
  protected dashboardData$: Observable<any> = this.store.select((state: any) => state.dashboard);
  protected expenseData$: Observable<any> = this.store.select((state: any) => state.expense);
  protected chartData: any;
  protected chartOptions: any;
  protected netWorthStartValue!: number;
  protected netWorthEndValue!: number;
  protected netWorthDollarChangeValue!: number;
  protected netWorthPercentChangeValue!: number;


  constructor(private store: Store) {}

  ngOnInit(): void {
    this.expenseData$.subscribe((data: ExpenseStateModel) => {
      // console.log(data);
    })
      
    this.dashboardData$.subscribe((data: DashboardStateModel) => {
      // console.log(data);
      if (data) {
        const monthExpenses: number = data.monthExpenses;
        const monthInvest: number = data.monthInvest;
        this.netWorthStartValue = monthExpenses;
        this.netWorthEndValue = monthInvest;
        this.netWorthDollarChangeValue = monthInvest - monthExpenses;
        this.netWorthPercentChangeValue = ( (monthInvest - monthExpenses) / monthExpenses );       
      };

    
      this.chartData = {
        labels: ['Nov', 'Dec', 'Jan'],
        datasets: [
          {
            label: false,
            data: [data.monthExpenses, data.monthIncome, data.monthInvest],
            borderColor: ['rgb(75, 192, 192)'],
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

    })
  }
}