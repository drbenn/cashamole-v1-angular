import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewIncomeTransactionComponent } from './new-income-transaction/new-income-transaction.component';
import { IncomeTableComponent } from './income-table/income-table.component';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, NewIncomeTransactionComponent, IncomeTableComponent],
  templateUrl: './income.component.html',
  styleUrl: './income.component.scss'
})
export class IncomeComponent {

}
