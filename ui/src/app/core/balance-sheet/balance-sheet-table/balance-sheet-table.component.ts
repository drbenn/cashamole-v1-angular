import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceSheetEntryBody } from '../../../model/balanceSheet.model';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-balance-sheet-table',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule],
  templateUrl: './balance-sheet-table.component.html',
  styleUrl: './balance-sheet-table.component.scss'
})
export class BalanceSheetTableComponent {
  @Input() tableTitle!: string;
  @Input() tableData!: BalanceSheetEntryBody[];

  protected editBalanceRecord(entry: BalanceSheetEntryBody) {
    console.log(entry);
  }
}
