import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseTableComponent } from './expense-table/expense-table.component';
import { NewExpenseTransactionComponent } from './new-expense-transaction/new-expense-transaction.component';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, ExpenseTableComponent, NewExpenseTransactionComponent],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss'
})
export class ExpenseComponent {

}
