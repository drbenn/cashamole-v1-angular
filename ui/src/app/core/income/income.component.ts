import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewIncomeTransactionComponent } from './new-income-transaction/new-income-transaction.component';
import { IncomeTableComponent } from './income-table/income-table.component';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { Income } from '../../model/core.model';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, NewIncomeTransactionComponent, IncomeTableComponent],
  templateUrl: './income.component.html',
  styleUrl: './income.component.scss'
})
export class IncomeComponent implements OnInit {
  protected income$: Observable<Income[]> = this.store.select((state) => state.income);
  protected activeMonthIncome!: Income[];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.income$.subscribe((income: any) => {
      if (income) {
        this.activeMonthIncome = income.income;
      };
    });
  };

}
