import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseTableComponent } from './expense-table/expense-table.component';
import { NewExpenseTransactionComponent } from './new-expense-transaction/new-expense-transaction.component';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { Expense } from '../../model/models.model';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, ExpenseTableComponent, NewExpenseTransactionComponent],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss'
})
export class ExpenseComponent implements OnInit {
  expenses$: Observable<Expense[]> = this.store.select((state) => state.expense.expenses);
  expenses!: Expense[];
  expenseCategorySet: Set<string> = new Set();
  expenseCategoryArray: string[] = [];
  expenseCategoryObject: any = {};

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.expenses$.subscribe((expenses: Expense[]) => {
      if (expenses) {
        expenses.forEach((expense: Expense) =>{
          this.expenseCategorySet.add(expense.category);
          this.expenseCategoryArray = Array.from(this.expenseCategorySet);
          if (!this.expenseCategoryObject[expense.category]) {
            this.expenseCategoryObject[expense.category] = [];
          } 
          this.expenseCategoryObject[expense.category].push(expense);
        },
          (error: any )=> console.log(error)
        )
      };   
    });
  };

}
