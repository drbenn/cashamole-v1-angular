import { Injectable } from '@angular/core';
import { 
  DashboardHistoryBalance,
  DashboardHistoryCashFlow,
  DashboardHistoryExpense,
  DashboardHistoryIncome,
  DashboardHistoryNetWorth
} from '../models/core.model';
import { ChartJsDataInputs } from '../models/dashboard.models';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  /**
   * Chart.js does not provide a default color palette, thus a custom color palette 
   * is created to return for use by all dashboard charts.
   * 
   * Visuals of colors saved in dashboard-colors.scss for quick reference/color preview
   */
  public chartTransparentColors(colorsRequired: number): string[] {
    const hexColorsArray: string[] = ["#ff9f4060", "#4bc0c060", "#9966ff60", "#36a2eb60", "#ff404060", "#efff4060", "#ff40df60", "#40efff60", "#40ff4660", "#405dff60", "#ff993960", "#6c6c6c60", "#c3ff4060", "#993a8c60", "#519da560", "#ff71a060"];
    return hexColorsArray.slice(0, colorsRequired);
  };

  public chartOpaqueColors(colorsRequired: number): string[] {
    const hexColorsArray: string[] = ["#ff9f40", "#4bc0c0", "#9966ff", "#36a2eb", "#ff4040", "#efff40", "#ff40df", "#40efff", "#40ff46", "#405dff", "#ff9939", "#6c6c6c", "#c3ff40", "#993a8c", "#519da5", "#ff71a0"];
    return hexColorsArray.slice(0, colorsRequired);
  };

  public configureDataInputsForMonthly(data: DashboardHistoryIncome[] | DashboardHistoryExpense[] | DashboardHistoryBalance[] | DashboardHistoryNetWorth[] | DashboardHistoryCashFlow[]): ChartJsDataInputs {
    let chartDataSet: number = 0;
    data.forEach((item: any) => {
      if (item.total_income) {
        chartDataSet += parseFloat(item.total_income);
      } else if (item.total_expense) {
        chartDataSet += parseFloat(item.total_expense);
      } else if (item.total_balance) {
        chartDataSet += parseFloat(item.total_balance);
      } else if (item.net_worth) {
        chartDataSet += parseFloat(item.net_worth);
      } else if (item.cash_flow) {
        chartDataSet += parseFloat(item.cash_flow);
      };
      
    });
    const labelOptions: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const label: string = labelOptions[parseInt(data[0].unique_date.slice(5, 7)) - 1];
    const backgroundColors: string[] = this.chartTransparentColors(1);
    const borderColors: string[] = this.chartTransparentColors(1);
    return {
      chartDataSet: [chartDataSet],
      labels: [label],
      backgroundColors: backgroundColors,
      borderColors: borderColors
    };
  };

  public configureDataInputsForAnnual(data: DashboardHistoryIncome[] | DashboardHistoryExpense[] | DashboardHistoryBalance[] | DashboardHistoryNetWorth[] | DashboardHistoryCashFlow[] ): ChartJsDataInputs {
    const chartDataSet: number[] = this.sumDataIntoMonthBaskets(data);
    const labels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const backgroundColors: string[] = this.chartTransparentColors(chartDataSet.length);
    const borderColors: string[] = this.chartTransparentColors(chartDataSet.length);
    return {
      chartDataSet: chartDataSet,
      labels: labels,
      backgroundColors: backgroundColors,
      borderColors: borderColors
    };
  };

  public configureDataInputsForAllTime(data: DashboardHistoryIncome[] | DashboardHistoryExpense[] | DashboardHistoryBalance[] | DashboardHistoryNetWorth[] | DashboardHistoryCashFlow[]): ChartJsDataInputs {
    // get unique years for filter
    const dataYears: string[] = Array.from(
      new Set(
        data.map((item: DashboardHistoryIncome | DashboardHistoryExpense | DashboardHistoryBalance | DashboardHistoryNetWorth | DashboardHistoryCashFlow ) => item.unique_date.slice(0, 4))
    ));
    dataYears.sort();

    const chartDataSet: number[] = this.sumDataIntoYearBaskets(data, dataYears);
    const labels: string[] = dataYears;
    const backgroundColors: string[] = this.chartTransparentColors(dataYears.length);
    const borderColors: string[] = this.chartTransparentColors(dataYears.length);
    return {
      chartDataSet: chartDataSet,
      labels: labels,
      backgroundColors: backgroundColors,
      borderColors: borderColors
    };
  };

  public sumDataIntoMonthBaskets(data: DashboardHistoryIncome[] | DashboardHistoryExpense[] | DashboardHistoryBalance[] | DashboardHistoryNetWorth[] | DashboardHistoryCashFlow[]): number[] {
    const twelveMonthsData: number[] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    data.forEach((item: any) => {
      const month: number = parseInt(item.unique_date.slice(5,8));
      let amount: number = 0;
      if (item && item.total_income) {
        amount = parseFloat(item.total_income);
      } else if (item && item.total_expense) {
        amount = parseFloat(item.total_expense);
      } else if (item && item.total_balance) {
        amount = parseFloat(item.total_balance);
      } else if (item && item.net_worth) {
        amount = parseFloat(item.net_worth);
      } else if (item.cash_flow) {
        amount += parseFloat(item.cash_flow);
      };
      twelveMonthsData[month - 1] = twelveMonthsData[month - 1] + amount;
    });
    return twelveMonthsData;
  };

  public sumDataIntoYearBaskets(data: DashboardHistoryIncome[] | DashboardHistoryExpense[] | DashboardHistoryBalance[] | DashboardHistoryNetWorth[] | DashboardHistoryCashFlow[], dataYears: string[]): number[] {
    const xYearData: number[] = new Array(dataYears.length).fill(0);
    data.forEach((item: any) => {
      const year: number = parseInt(item.unique_date.slice(0,4));
      let amount: number = 0;
      if (item && item.total_income) {
        amount = parseFloat(item.total_income);
      } else if (item && item.total_expense) {
        amount = parseFloat(item.total_expense);
      } else if (item && item.total_balance) {
        amount = parseFloat(item.total_balance);
      } else if (item && item.net_worth) {
        amount = parseFloat(item.net_worth);
      } else if (item.cash_flow) {
        amount += parseFloat(item.cash_flow);
      };
      const itemIndex: number = dataYears.findIndex((_year: string) => _year === year.toString());
      xYearData[itemIndex] = xYearData[itemIndex] + amount;
    });
    return xYearData;
  };

}
