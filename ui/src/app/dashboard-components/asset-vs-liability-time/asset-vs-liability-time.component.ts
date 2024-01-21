import { Component, OnInit } from '@angular/core';
import { DashboardStateModel } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ChartModule } from 'primeng/chart';
import { ExpenseStateModel } from '../../store/expense/expense.state';

@Component({
  selector: 'app-asset-vs-liability-time',
  standalone: true,
  imports: [CardModule, ChartModule],
  templateUrl: './asset-vs-liability-time.component.html',
  styleUrl: './asset-vs-liability-time.component.scss'
})
export class AssetVsLiabilityTimeComponent implements OnInit {
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
            label: 'Net Assets',
            data: [data.monthExpenses, data.monthIncome, data.monthInvest],
            borderColor: ['rgb(54, 162, 235)'],
            borderWidth: 2,
            tension: 0.3
          },
          {
            label: 'Net Liaibilities',
            data: [data.monthIncome, data.monthInvest, data.monthExpenses],
            borderColor: ['rgb(255, 64, 64)'],
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