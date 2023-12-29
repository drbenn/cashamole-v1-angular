import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DashboardStateModel } from '../../store/dashboard/dashboard.state';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-month-net-asset-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './month-net-asset-banner.component.html',
  styleUrl: './month-net-asset-banner.component.scss'
})
export class MonthNetAssetBannerComponent implements OnInit {
  protected dashboardData$: Observable<any> = this.store.select((state: any) => state.dashboard);
  protected monthAssets: number = 0;
  protected monthLiabilities: number = 0;
  protected monthNetWorth: number = 0;

  constructor(private store: Store) {}

  ngOnInit(): void {
      this.dashboardData$.subscribe((data: DashboardStateModel) => {
        this.monthAssets = data.monthAssets;
        this.monthLiabilities = data.monthLiabilities;
        this.monthNetWorth = data.monthNetWorth;
      })
  }
}
