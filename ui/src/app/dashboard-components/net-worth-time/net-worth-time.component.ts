import { Component, OnInit } from '@angular/core';
import { DashboardState, DashboardStateModel } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';
import { Observable, last } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ChartModule } from 'primeng/chart';
import { ExpenseStateModel } from '../../store/expense/expense.state';
import { CommonModule } from '@angular/common';
import { DashboardHistoryBalance } from '../../models/core.model';
import { DashboardService } from '../dashboard.service';
import { BarChartDataInputs } from '../../models/dashboard.models';

@Component({
  selector: 'app-net-worth-time',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule],
  templateUrl: './net-worth-time.component.html',
  styleUrl: './net-worth-time.component.scss'
})
export class NetWorthTimeComponent implements OnInit {
  @Select(DashboardState.assetLiabilityHistoryChartData) data$!: Observable<{ userView: string, data: DashboardHistoryBalance[], annualFilterData: DashboardHistoryBalance[], activeMonth: string, activeYear: string }>;
  protected chartData: any;
  protected chartOptions: any;
  protected userView: string = '';

  constructor(
    private dashboardService: DashboardService
  ) {}
  ngOnInit(): void {
    this.data$.subscribe((data: { userView: string, data: DashboardHistoryBalance[], annualFilterData: DashboardHistoryBalance[], activeMonth: string, activeYear: string }) => {
      if (data) {
        this.userView = data.userView;
        const assets: DashboardHistoryBalance[] = data.data.filter(data => data.type === 'asset');
        const liabilities: DashboardHistoryBalance[] = data.data.filter(data => data.type === 'liability');
  
        if (data.userView === 'annual') {
          const assets: DashboardHistoryBalance[] = data.annualFilterData.filter(data => data.type === 'asset');
          const liabilities: DashboardHistoryBalance[] = data.annualFilterData.filter(data => data.type === 'liability');
          const annualNetWorthData: BarChartDataInputs  = this.aggregateAnnualNetWorth(assets, liabilities, data.activeYear);
          this.updateChart(annualNetWorthData);
        };
        if (data.userView=== 'all-time') {
          const alltimeNetWorthData: BarChartDataInputs  = this.aggregateAllTimeNetWorth(assets, liabilities);
          this.updateChart(alltimeNetWorthData);
        };
        if (data.userView=== 'monthly') {          
          const monthAssets: DashboardHistoryBalance[] = data.data.filter(_data => _data.type === 'asset' && _data.unique_date.slice(0,4) === data.activeYear && _data.unique_date.slice(5,8) === data.activeMonth);
          const monthLiabilities: DashboardHistoryBalance[] = data.data.filter(_data => _data.type === 'liability' && _data.unique_date.slice(0,4) === data.activeYear && _data.unique_date.slice(5,8) === data.activeMonth);          
          const alltimeNetWorthData: BarChartDataInputs  = this.aggregateMonthlyNetWorth(monthAssets, monthLiabilities);
          this.updateChart(alltimeNetWorthData);
        };
      };
    });
  };

  private updateChart(data: BarChartDataInputs) {
    this.chartData = {
      labels: data.labels,
      datasets: [
        {
          label: 'Net Worth',
          data: data.chartDataSet,
          backgroundColor: ['#9ce0c160'],
          borderColor: ['#9ce0c1'],
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
  };

  private aggregateMonthlyNetWorth(assets: DashboardHistoryBalance[], liabilities: DashboardHistoryBalance[]): BarChartDataInputs {   
    let balance: number = 0;
    assets.forEach((item: DashboardHistoryBalance) => balance += parseFloat(item.total_balance));
    liabilities.forEach((item: DashboardHistoryBalance) => balance -= parseFloat(item.total_balance));
    const monthlabelOptions: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const label: string = monthlabelOptions[parseInt(assets[0].unique_date.slice(5,8)) - 1];
    return {
      chartDataSet: [balance],
      labels: [label],
      backgroundColors: [],
      borderColors: []
    };
  }

  private aggregateAnnualNetWorth(assets: DashboardHistoryBalance[], liabilities: DashboardHistoryBalance[], activeYear: string): BarChartDataInputs {    
    // get unique months for filter
    const dataMonths: string[] = Array.from(
      new Set(
        assets.map((item: DashboardHistoryBalance) => item.unique_date.slice(5, 8))
    ));
    dataMonths.sort();

    // get months with balance data
    const monthlabelOptions: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthLabelsUsed: string[] = [];
    dataMonths.forEach((month: string) => monthLabelsUsed.push(monthlabelOptions[ parseInt(month) - 1 ]));

    const xMonthData: number[] = new Array(monthLabelsUsed.length).fill(0);

    assets.forEach((item: DashboardHistoryBalance) => {
      const monthNumIndex: number = parseInt(item.unique_date.slice(5,8)) - 1;
      const monthString: string = monthlabelOptions[monthNumIndex];
      const index: number = monthLabelsUsed.findIndex((month: string) => month === monthString);
      xMonthData[index] += parseFloat(item.total_balance);
    });
    liabilities.forEach((item: DashboardHistoryBalance) => {
      const monthNumIndex: number = parseInt(item.unique_date.slice(5,8)) - 1;
      const monthString: string = monthlabelOptions[monthNumIndex];
      const index: number = monthLabelsUsed.findIndex((month: string) => month === monthString);
      xMonthData[index] -= parseFloat(item.total_balance);
    })

    const chartDataSet: number[] = xMonthData;
    const labels: string[] = monthLabelsUsed;
    const backgroundColors: string[] = [];
    const borderColors: string[] = [];
    return {
      chartDataSet: chartDataSet,
      labels: labels,
      backgroundColors: backgroundColors,
      borderColors: borderColors
    };
  };

  private aggregateAllTimeNetWorth(assets: DashboardHistoryBalance[], liabilities: DashboardHistoryBalance[]): BarChartDataInputs {
    // get unique years for filter
    const dataYears: string[] = Array.from(
      new Set(
        assets.map((item: DashboardHistoryBalance) => item.unique_date.slice(0, 4))
    ));
    dataYears.sort();

    // set blank array to offset with annual asset/liability amounts
    const xYearData: number[] = new Array(dataYears.length).fill(0);

    // Assets earliest month of first year
    if (dataYears && dataYears.length) {
      const firstYearData = assets.filter((data: DashboardHistoryBalance) => data.unique_date.slice(0, 4) === dataYears[0]);
      const sortedFirstYearData = firstYearData.sort((a,b) => a.unique_date.localeCompare(b.unique_date));
      const firstMonthOfFirstYear: string = sortedFirstYearData[0].unique_date.slice(5,8);
      const firstMonthData: DashboardHistoryBalance[] = sortedFirstYearData.filter((data: DashboardHistoryBalance) => data.unique_date.slice(5,8) === firstMonthOfFirstYear);
      let firstMonthBalance: number = 0;
      firstMonthData.forEach((data: DashboardHistoryBalance) => firstMonthBalance += parseFloat(data.total_balance));
      xYearData[0] += firstMonthBalance;
    };

    // Liabilities earliest month of first year
    if (dataYears && dataYears.length) {
      const firstYearData = liabilities.filter((data: DashboardHistoryBalance) => data.unique_date.slice(0, 4) === dataYears[0]);
      const sortedFirstYearData = firstYearData.sort((a,b) => a.unique_date.localeCompare(b.unique_date));
      const firstMonthOfFirstYear: string = sortedFirstYearData[0].unique_date.slice(5,8);
      const firstMonthData: DashboardHistoryBalance[] = sortedFirstYearData.filter((data: DashboardHistoryBalance) => data.unique_date.slice(5,8) === firstMonthOfFirstYear);
      let firstMonthBalance: number = 0;
      firstMonthData.forEach((data: DashboardHistoryBalance) => firstMonthBalance += parseFloat(data.total_balance));
      xYearData[0] -= firstMonthBalance;
    };


    // Assets Middle Year
    if (dataYears && dataYears.length > 2 ) {
      const middleYears: string[] = dataYears.slice(1, dataYears.length - 1);
      middleYears.forEach((year: string, index) => {
        const yearData: DashboardHistoryBalance[] = assets.filter((item: DashboardHistoryBalance) => item.unique_date.slice(0, 4) === year);
        const sortedYearData = yearData.sort((a,b) => a.unique_date.localeCompare(b.unique_date));
        const firstMonthOfYear: string = sortedYearData[0].unique_date.slice(5,8);
        const firstMonthData: DashboardHistoryBalance[] = sortedYearData.filter((data: DashboardHistoryBalance) => data.unique_date.slice(5,8) === firstMonthOfYear);
        let firstMonthBalance: number = 0;
        firstMonthData.forEach((data: DashboardHistoryBalance) => firstMonthBalance += parseFloat(data.total_balance));       
        xYearData[index + 1] += firstMonthBalance
      });
    };

    // Liabilities Middle years
    if (dataYears && dataYears.length > 2 ) {
      const middleYears: string[] = dataYears.slice(1, dataYears.length - 1);
      middleYears.forEach((year: string, index) => {
        const yearData: DashboardHistoryBalance[] = liabilities.filter((item: DashboardHistoryBalance) => item.unique_date.slice(0, 4) === year);
        const sortedYearData = yearData.sort((a,b) => a.unique_date.localeCompare(b.unique_date));
        const firstMonthOfYear: string = sortedYearData[0].unique_date.slice(5,8);
        const firstMonthData: DashboardHistoryBalance[] = sortedYearData.filter((data: DashboardHistoryBalance) => data.unique_date.slice(5,8) === firstMonthOfYear);
        let firstMonthBalance: number = 0;
        firstMonthData.forEach((data: DashboardHistoryBalance) => firstMonthBalance += parseFloat(data.total_balance));       
        xYearData[index + 1] -= firstMonthBalance
      });
    };


    // last year assets
    if (dataYears && dataYears.length > 1 ) {
      const lastDataYear: number = dataYears.length - 1;
      const lastYearData = assets.filter((data: DashboardHistoryBalance) => data.unique_date.slice(0, 4) === dataYears[lastDataYear]);
      const sortedLastYearData = lastYearData.sort((a,b) => a.unique_date.localeCompare(b.unique_date));
      const today: Date = new Date();
      const todayMonth: string = today.toLocaleDateString('en-US', { month: '2-digit' });
      const lastMonthData: DashboardHistoryBalance[] = sortedLastYearData.filter((data: DashboardHistoryBalance) => data.unique_date.slice(5,8) === todayMonth);
      let lastMonthBalance: number = 0;
      lastMonthData.forEach((data: DashboardHistoryBalance) => lastMonthBalance += parseFloat(data.total_balance));
      xYearData[lastDataYear] += lastMonthBalance;
    };

    // last year Liabilities
    if (dataYears && dataYears.length > 1 ) {
      const lastDataYear: number = dataYears.length - 1;
      const lastYearData = liabilities.filter((data: DashboardHistoryBalance) => data.unique_date.slice(0, 4) === dataYears[lastDataYear]);
      const sortedLastYearData = lastYearData.sort((a,b) => a.unique_date.localeCompare(b.unique_date));
      const today: Date = new Date();
      const todayMonth: string = today.toLocaleDateString('en-US', { month: '2-digit' });
      const lastMonthData: DashboardHistoryBalance[] = sortedLastYearData.filter((data: DashboardHistoryBalance) => data.unique_date.slice(5,8) === todayMonth);
      let lastMonthBalance: number = 0;
      lastMonthData.forEach((data: DashboardHistoryBalance) => lastMonthBalance -= parseFloat(data.total_balance));
      xYearData[lastDataYear] -= lastMonthBalance;
    };
    
    return {
      chartDataSet: xYearData,
      labels: dataYears,
      backgroundColors: [],
      borderColors: []
    };
  };
}
