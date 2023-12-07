import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionBody } from '../../../model/transaction.model';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { Expense } from '../../../model/models.model';

@Component({
  selector: 'app-expense-table',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule],
  templateUrl: './expense-table.component.html',
  styleUrl: './expense-table.component.scss'
})
export class ExpenseTableComponent implements OnInit {
  @Input() tableTitle!: string;
  @Input() tableData!: Expense[];

  ngOnInit(): void {
    
  }

  protected editTransactionRecord(transaction: TransactionBody) {
    console.log(transaction);
  }
}
