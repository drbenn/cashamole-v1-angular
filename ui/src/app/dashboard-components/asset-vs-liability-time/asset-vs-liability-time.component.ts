import { Component, OnInit } from '@angular/core';
import { DashboardState } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { ChartModule } from 'primeng/chart';
import { DashboardHistoryBalance } from '../../models/core.model';
import { DashboardService } from '../dashboard.service';
import { BarChartDataInputs } from '../../models/dashboard.models';

@Component({
  selector: 'app-asset-vs-liability-time',
  standalone: true,
  imports: [CardModule, ChartModule],
  templateUrl: './asset-vs-liability-time.component.html',
  styleUrl: './asset-vs-liability-time.component.scss'
})
export class AssetVsLiabilityTimeComponent implements OnInit {
  @Select(DashboardState.assetLiabilityHistoryChartData) data$!: Observable<{ userView: string, data: DashboardHistoryBalance[], annualFilterData: DashboardHistoryBalance[], activeMonth: string, activeYear: string }>;
  protected chartData: any;
  protected chartOptions: any;

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.data$.subscribe((data: { userView: string, data: DashboardHistoryBalance[], annualFilterData: DashboardHistoryBalance[], activeMonth: string, activeYear: string }) => {
      if (data) {
        const assets: DashboardHistoryBalance[] = data.data.filter(data => data.type === 'asset');
        const liablities: DashboardHistoryBalance[] = data.data.filter(data => data.type === 'liability');
  
        if (data.userView === 'annual') {
          const assets: DashboardHistoryBalance[] = data.annualFilterData.filter(data => data.type === 'asset');
          const liabilities: DashboardHistoryBalance[] = data.annualFilterData.filter(data => data.type === 'liability');
          const annualChartDataAssets: BarChartDataInputs  = this.configureBalanceDataInputsForAnnual(assets);
          const annualChartDataLiabilities: BarChartDataInputs  = this.configureBalanceDataInputsForAnnual(liablities);
          this.updateChart(annualChartDataAssets, annualChartDataLiabilities);
        };
        if (data.userView=== 'all-time') {
          const allTimeChartDataAssets: BarChartDataInputs  = this.configureBalanceDataInputsForAllTime(assets);
          const allTimeChartDataLiabilities: BarChartDataInputs  = this.configureBalanceDataInputsForAllTime(liablities);
          this.updateChart(allTimeChartDataAssets, allTimeChartDataLiabilities);
        };
        if (data.userView=== 'monthly') {        
          const monthlyChartDataAssets: BarChartDataInputs  = this.configureBalanceDataInputsForMonthly(assets, data.activeMonth, data.activeYear);
          const monthlyChartDataLiabilities: BarChartDataInputs  = this.configureBalanceDataInputsForMonthly(liablities, data.activeMonth, data.activeYear);
          this.updateChart(monthlyChartDataAssets, monthlyChartDataLiabilities);
        };
      };
    });
  };


  private updateChart(assetData: BarChartDataInputs, liabilityData: BarChartDataInputs) {
    this.chartData = {
      labels: assetData.labels,
      datasets: [
        {
          label: 'Net Assets',
          data: assetData.chartDataSet,
          borderColor: ['rgb(54, 162, 235)'],
          borderWidth: 2,
          tension: 0.3
        },
        {
          label: 'Net Liaibilities',
          data: liabilityData.chartDataSet,
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
  };




  /**
   * Annual Functions
   * @param data 
   * @returns 
   */
  private configureBalanceDataInputsForAnnual(data: DashboardHistoryBalance[]): BarChartDataInputs {
    // get unique months for filter
    const dataMonths: string[] = Array.from(
      new Set(
        data.map((item: DashboardHistoryBalance) => item.unique_date.slice(5, 8))
    ));
    dataMonths.sort();

    // get months with balance data
    const monthlabelOptions: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthLabelsUsed: string[] = [];
    dataMonths.forEach((month: string) => monthLabelsUsed.push(monthlabelOptions[ parseInt(month) - 1 ]));

    const chartDataSet: number[] = this.getMonthBalanceDataFromAnnual(data, dataMonths);
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

  /**
   * 
   * @param data 
   * @param dataMonths - ie ['01', '02', '03' ... , '12']
   * @returns 
   */
  private getMonthBalanceDataFromAnnual(data: DashboardHistoryBalance[], dataMonths: string[]): number[] {
    const xMonthData: number[] = new Array(dataMonths.length).fill(0);
    const sortedYearData = data.sort((a,b) => a.unique_date.localeCompare(b.unique_date));
    
    // first month
    if (dataMonths && dataMonths.length) {
      const firstMonthOfYear: string = sortedYearData[0].unique_date.slice(5,8);
      const firstMonthData: DashboardHistoryBalance[] = sortedYearData.filter((data: DashboardHistoryBalance) => data.unique_date.slice(5,8) === firstMonthOfYear);
      let firstMonthBalance: number = 0;
      firstMonthData.forEach((data: DashboardHistoryBalance) => firstMonthBalance += parseFloat(data.total_balance));
      xMonthData[0] = firstMonthBalance;
    };
    
    // middle months
    if (dataMonths && dataMonths.length > 2 ) {
      const middleMonths: string[] = dataMonths.slice(1, dataMonths.length - 1);
      middleMonths.forEach((month: string, index) => {
        const monthData: DashboardHistoryBalance[] = data.filter((item: DashboardHistoryBalance) => item.unique_date.slice(5,8) === month);
        // const sortedMonthData = monthData.sort((a,b) => a.unique_date.localeCompare(b.unique_date));
        // const firstMonthOfYear: string = sortedMonthData[0].unique_date.slice(5,8);
        // const firstMonthData: DashboardHistoryBalance[] = sortedMonthData.filter((data: DashboardHistoryBalance) => data.unique_date.slice(5,8) === firstMonthOfYear);
        let monthBalance: number = 0;
        monthData.forEach((data: DashboardHistoryBalance) => monthBalance += parseFloat(data.total_balance));       
        xMonthData[index + 1] = monthBalance
      });
    };
    
    // last month
    if (dataMonths && dataMonths.length > 1 ) {
      const lastMonthOfYear: string = sortedYearData[sortedYearData.length - 1].unique_date.slice(5,8);
      const lastMonthData = data.filter((data: DashboardHistoryBalance) => data.unique_date.slice(5, 8) === lastMonthOfYear);
      let lastMonthBalance: number = 0;
      lastMonthData.forEach((data: DashboardHistoryBalance) => lastMonthBalance += parseFloat(data.total_balance));
      xMonthData[xMonthData.length - 1] = lastMonthBalance;
    };
    return xMonthData;
  };

  /**
   * All time functions
   * @param data 
   * @returns 
   */
  private configureBalanceDataInputsForAllTime(data: DashboardHistoryBalance[]): BarChartDataInputs {
    // get unique years for filter
    const dataYears: string[] = Array.from(
      new Set(
        data.map((item: DashboardHistoryBalance) => item.unique_date.slice(0, 4))
    ));
    dataYears.sort();

    const chartDataSet: number[] = this.getAnnualBalanceData(data, dataYears);
    const labels: string[] = dataYears;
    const backgroundColors: string[] = [];
    const borderColors: string[] = [];
    return {
      chartDataSet: chartDataSet,
      labels: labels,
      backgroundColors: backgroundColors,
      borderColors: borderColors
    };
  };

  private getAnnualBalanceData(data: DashboardHistoryBalance[], dataYears: string[]): number[] {
    const xYearData: number[] = new Array(dataYears.length).fill(0);
    // get sum of first month of data in first year for first year/start point
    if (dataYears && dataYears.length) {
    const firstYearData = data.filter((data: DashboardHistoryBalance) => data.unique_date.slice(0, 4) === dataYears[0]);
    const sortedFirstYearData = firstYearData.sort((a,b) => a.unique_date.localeCompare(b.unique_date));
    const firstMonthOfFirstYear: string = sortedFirstYearData[0].unique_date.slice(5,8);
    const firstMonthData: DashboardHistoryBalance[] = sortedFirstYearData.filter((data: DashboardHistoryBalance) => data.unique_date.slice(5,8) === firstMonthOfFirstYear);
    let firstMonthBalance: number = 0;
    firstMonthData.forEach((data: DashboardHistoryBalance) => firstMonthBalance += parseFloat(data.total_balance));
    xYearData[0] = firstMonthBalance;
    };
    
    // get sum of first month of next year for each middle year
    if (dataYears && dataYears.length > 2 ) {
      const middleYears: string[] = dataYears.slice(1, dataYears.length - 1);
      middleYears.forEach((year: string, index) => {
        const yearData: DashboardHistoryBalance[] = data.filter((item: DashboardHistoryBalance) => item.unique_date.slice(0, 4) === year);
        const sortedYearData = yearData.sort((a,b) => a.unique_date.localeCompare(b.unique_date));
        const firstMonthOfYear: string = sortedYearData[0].unique_date.slice(5,8);
        const firstMonthData: DashboardHistoryBalance[] = sortedYearData.filter((data: DashboardHistoryBalance) => data.unique_date.slice(5,8) === firstMonthOfYear);
        let firstMonthBalance: number = 0;
        firstMonthData.forEach((data: DashboardHistoryBalance) => firstMonthBalance += parseFloat(data.total_balance));       
        xYearData[index + 1] = firstMonthBalance
      });
    };
    
    // For last year, get sum of last available month in last/this year for this year/end point
    if (dataYears && dataYears.length > 1 ) {
      const lastDataYear: number = dataYears.length - 1;
      const lastYearData = data.filter((data: DashboardHistoryBalance) => data.unique_date.slice(0, 4) === dataYears[lastDataYear]);
      const sortedLastYearData = lastYearData.sort((a,b) => a.unique_date.localeCompare(b.unique_date));
      const today: Date = new Date();
      const todayMonth: string = today.toLocaleDateString('en-US', { month: '2-digit' });

      // const lastMonthOfLastYear: string = sortedLastYearData[sortedLastYearData.length - 1].unique_date.slice(5,8);
      const lastMonthData: DashboardHistoryBalance[] = sortedLastYearData.filter((data: DashboardHistoryBalance) => data.unique_date.slice(5,8) === todayMonth);
      let lastMonthBalance: number = 0;
      lastMonthData.forEach((data: DashboardHistoryBalance) => lastMonthBalance += parseFloat(data.total_balance));
      xYearData[lastDataYear] = lastMonthBalance;
    };
    return xYearData;
  };

  /**
   *  Monthly functions
   * @param data 
   * @param activeMonth - ie '01' for january or '05' for May
   * @returns 
   */
  private configureBalanceDataInputsForMonthly(data: DashboardHistoryBalance[], activeMonth: string, activeYear: string): BarChartDataInputs {

    // find current month and next month for labels
    const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];
    const currentMonth: string = months[parseInt(activeMonth) - 1];
    const nextMonth: string = months[parseInt(activeMonth)];

    // start value   
    const startMonthData: DashboardHistoryBalance[] = data.filter((data: DashboardHistoryBalance) => data.unique_date.slice(5,8) === activeMonth && data.unique_date.slice(0,4) === activeYear);
    let startBalance: number = 0
    startMonthData.forEach((item: DashboardHistoryBalance) => startBalance += parseFloat(item.total_balance));
    
    // end value
    let nextMonthDigitString: string = '';
    let nextMonthDigitStringYear: string = '';
    if (activeMonth === '12') {
      nextMonthDigitString = '01';
      nextMonthDigitStringYear = (parseInt(activeYear) + 1).toString();
    } else {
      nextMonthDigitString = (parseInt(activeMonth) + 1).toString().length === 1 ? '0' + (parseInt(activeMonth) + 1).toString() : (parseInt(activeMonth) + 1).toString();
      nextMonthDigitStringYear = activeYear;
    };

    const endMonthData: DashboardHistoryBalance[] = data.filter((data: DashboardHistoryBalance) => data.unique_date.slice(5,8) === nextMonthDigitString && data.unique_date.slice(0,4) === nextMonthDigitStringYear);
    let endBalance: number = 0
    endMonthData.forEach((item: DashboardHistoryBalance) => endBalance += parseFloat(item.total_balance));
    const chartDataSet: number[] = [startBalance, endBalance];
    const labels: string[] = [currentMonth, nextMonth];
    const backgroundColors: string[] = [];
    const borderColors: string[] = [];
    return {
      chartDataSet: chartDataSet,
      labels: labels,
      backgroundColors: backgroundColors,
      borderColors: borderColors
    };
  };

}