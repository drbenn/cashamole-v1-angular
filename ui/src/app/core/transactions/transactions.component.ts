import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TransactionBody } from '../../model/transaction.model';
import { Store } from '@ngxs/store';
import { TransactionTableComponent } from './transaction-table/transaction-table.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { ExpenseTableComponent } from '../expense/expense-table/expense-table.component';
import { IncomeTableComponent } from '../income/income-table/income-table.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, TransactionTableComponent, NewTransactionComponent,ExpenseTableComponent, IncomeTableComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
  // transactions$: Observable<any> = this.store.select((state) => state.user.transactions);
  // // tableCategories: Set<string> | [] = new Set();
  // // transactionSets: any = {};

  // expenseCategorySet: Set<string> = new Set();
  // expenseCategoryArray: string[] = [];
  // expenseTransactionObjects: any = {};

  // incomeTransactionObjects: any = [];


  // constructor(private store: Store) {}

  ngOnInit(): void {
    // this.getAndSetTransactions();
  };

  // private getAndSetTransactions(): void {
  //   this.transactions$.subscribe((entries: TransactionBody[]) => {
  //     if (entries) {
  //       console.log(entries);
        
  //       entries.forEach((entry: TransactionBody) => {
  //         // income hit first because category field may be undefined
  //         if (entry.type === 'income') {
  //           this.incomeTransactionObjects.push(entry);
  //         }
  //         if (entry.type === 'expense') {
  //           console.log(entry);
  //           this.expenseCategorySet.add(entry.category);
  //           this.expenseCategoryArray = Array.from(this.expenseCategorySet);
  //           if (!this.expenseTransactionObjects[entry.category]) {
  //             this.expenseTransactionObjects[entry.category] = [];
  //           } 
  //           this.expenseTransactionObjects[entry.category].push(entry);
  //         } 
          

  //       });

  //     }
  //     console.log(this.expenseCategoryArray);
  //     console.log(this.expenseTransactionObjects);
  //     console.log(this.incomeTransactionObjects);
      
      
      
  //   },
  //     (error: any )=> console.log(error)
  //   );
  // }

}
