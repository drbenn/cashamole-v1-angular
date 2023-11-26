import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionBody } from '../../../model/transaction.model';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.scss'
})
export class TransactionTableComponent {
  @Input() tableTitle!: string;
  @Input() tableData!: TransactionBody[];

  protected editTransactionRecord(transaction: TransactionBody) {
    console.log(transaction);
  }

}
