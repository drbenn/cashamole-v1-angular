import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { Invest } from '../../model/core.model';
import { MonthNetCashFlowBannerComponent } from '../../shared/month-net-cash-flow-banner/month-net-cash-flow-banner.component';
import { InvestTableComponent } from './invest-table/invest-table.component';
import { NewInvestTransactionComponent } from './new-invest-transaction/new-invest-transaction.component';

@Component({
  selector: 'app-invest',
  standalone: true,
  imports: [CommonModule, NewInvestTransactionComponent, InvestTableComponent, MonthNetCashFlowBannerComponent],
  templateUrl: './invest.component.html',
  styleUrl: './invest.component.scss'
})
export class InvestComponent implements OnInit {
  protected investments$: Observable<Invest[]> = this.store.select((state) => state.invest);
  protected activeMonthInvestments!: Invest[];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.investments$.subscribe((investments: any) => {
      if (investments) {
        this.activeMonthInvestments = investments.investments;
      };
    });
  };

}
