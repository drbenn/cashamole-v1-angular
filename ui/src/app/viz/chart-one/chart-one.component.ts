import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { DashboardStateModel } from '../../store/dashboard/dashboard.state';

@Component({
  selector: 'app-chart-one',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './chart-one.component.html',
  styleUrl: './chart-one.component.scss'
})
export class ChartOneComponent implements OnInit {
    protected dashboardData$: Observable<any> = this.store.select((state: any) => state.dashboard);
    protected basicData: any;
    protected basicOptions: any;
    protected horoOptions: any;

    private monthIncome: number = 0;
    private monthExpenses: number = 0;
    private monthNetCashFlow: number = 0;

    constructor(private store: Store) {}

    ngOnInit() {
        this.dashboardData$.subscribe((data: DashboardStateModel) => {
            // console.log(data);
            this.monthIncome = data.monthIncome;
            this.monthExpenses = data.monthExpenses;
            this.monthNetCashFlow = data.monthNetCashFlow;
            console.log(this.monthIncome, this.monthExpenses, this.monthNetCashFlow);

            // entire data object must be replaced for live data udate/render
            this.basicData = {
                labels: ['Income', 'Expenses', 'Net Cash'],
                datasets: [
                    {
                        label: 'Month Cash Flow',
                        data: [this.monthIncome, this.monthExpenses, this.monthNetCashFlow],
                        backgroundColor: ['rgba(255, 0, 0, 1.0)', 'rgba(0, 0, 255, 0.9)', 'rgba(54, 162, 235, 0.2)'],
                        borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                        borderWidth: 1
                    }
                ]
            };
            
          })
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');



        // this.basicData = {
        //     labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        //     datasets: [
        //         {
        //             label: 'Month Cash Flow',
        //             data: [540, 325, 702, 620],
        //             backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        //             borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
        //             borderWidth: 1
        //         }
        //     ]
        // };

        this.basicOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        this.horoOptions = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }
}

