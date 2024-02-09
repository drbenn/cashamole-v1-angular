import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { Invest } from '../../models/core.model';
import { InvestTableComponent } from './invest-table/invest-table.component';
import { NewInvestTransactionComponent } from './new-invest-transaction/new-invest-transaction.component';
import { MonthCashInvestedSummaryComponent } from "../../dashboard-components/month-cash-invested-summary/month-cash-invested-summary.component";
import { ProgressSpinnerComponent } from '../../shared/progress-spinner/progress-spinner.component';

@Component({
    selector: 'app-invest',
    standalone: true,
    templateUrl: './invest.component.html',
    styleUrl: './invest.component.scss',
    imports: [CommonModule, NewInvestTransactionComponent, InvestTableComponent, MonthCashInvestedSummaryComponent, ProgressSpinnerComponent]
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
