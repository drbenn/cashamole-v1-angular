import { Component, OnInit } from '@angular/core';
import { DashboardState } from '../../store/dashboard/dashboard.state';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { ChartModule } from 'primeng/chart';
import { DashboardHistoryBalance } from '../../models/core.model';
import { DashboardService } from '../dashboard.service';
import { ChartJsDataInputs } from '../../models/dashboard.models';

@Component({
  selector: 'app-asset-vs-liability-time',
  standalone: true,
  imports: [CardModule, ChartModule],
  templateUrl: './asset-vs-liability-time.component.html',
  styleUrl: './asset-vs-liability-time.component.scss'
})
export class AssetVsLiabilityTimeComponent implements OnInit {
  @Select(DashboardState.assetVsLiabilityHistoryChartData) data$!: Observable<{ userView: string, assetData: DashboardHistoryBalance[], liabilityData: DashboardHistoryBalance[] }>;
  protected chartData: any;
  protected chartOptions: any;
  protected userView!: string;

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.data$.subscribe((data: { userView: string, assetData: DashboardHistoryBalance[], liabilityData: DashboardHistoryBalance[] }) => {
      this.userView = data.userView;
      if (data.userView === 'monthly') {
        const annualAssetChartData: ChartJsDataInputs  = this.dashboardService.configureDataInputsForMonthly(data.assetData);
        const annualLiabilityChartData: ChartJsDataInputs  = this.dashboardService.configureDataInputsForMonthly(data.liabilityData);
        this.updateChart(annualAssetChartData, annualLiabilityChartData);
      } else if (data.userView === 'annual') {
        const annualAssetChartData: ChartJsDataInputs  = this.dashboardService.configureDataInputsForAnnual(data.assetData);
        const annualLiabilityChartData: ChartJsDataInputs  = this.dashboardService.configureDataInputsForAnnual(data.liabilityData);
        this.updateChart(annualAssetChartData, annualLiabilityChartData);
      } else if (data.userView=== 'all-time') {
        const allTimeAssetChartData: ChartJsDataInputs  = this.dashboardService.configureDataInputsForAllTime(data.assetData);
        const allTimeLiabilityChartData: ChartJsDataInputs  = this.dashboardService.configureDataInputsForAllTime(data.liabilityData);
        this.updateChart(allTimeAssetChartData, allTimeLiabilityChartData);
      };
    });
  
  };

  private updateChart(assetData: ChartJsDataInputs, liabilityData: ChartJsDataInputs) {
    this.chartData = {
      labels: assetData.labels,
      datasets: [
        {
          label: 'Net Assets',
          data: assetData.chartDataSet,
          backgroundColor: [assetData.backgroundColors[0]],
          borderColor: [assetData.borderColors[0]],
          hoverBackgroundColor: [assetData.borderColors[0]],
          borderWidth: 2,
          tension: 0.3
        },
        {
          label: 'Net Liabilities',
          data: liabilityData.chartDataSet,
          backgroundColor: ['#4bc0c060'],
          borderColor: ['#4bc0c0'],
          hoverBackgroundColor: ['#4bc0c0'],
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

}
