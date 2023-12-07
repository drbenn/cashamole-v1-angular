import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewIncomeTransactionComponent } from './new-income-transaction/new-income-transaction.component';
import { IncomeTableComponent } from './income-table/income-table.component';
import { Observable } from 'rxjs';
import { Income } from '../../model/models.model';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, NewIncomeTransactionComponent, IncomeTableComponent],
  templateUrl: './income.component.html',
  styleUrl: './income.component.scss'
})
export class IncomeComponent implements OnInit {
  income$: Observable<Income[]> = this.store.select((state) => state.income.income);
  income!: Income[];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.income$.subscribe((income: Income[]) => {
      if (income) {
        this.income = income;
      };
    });
  };

}
