import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionBody } from '../../../model/transaction.model';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Income } from '../../../model/models.model';

@Component({
  selector: 'app-income-table',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule],
  templateUrl: './income-table.component.html',
  styleUrl: './income-table.component.scss'
})
export class IncomeTableComponent implements OnInit {
  @Input() tableTitle!: string;
  @Input() tableData!: Income[];

  ngOnInit(): void {

    
    
    
  }

  protected editTransactionRecord(transaction: TransactionBody) {
    console.log(transaction);
  }
}
