import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { BalanceSheetEntry } from '../../../model/models.model';

@Component({
  selector: 'app-balance-sheet-table',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule],
  templateUrl: './balance-sheet-table.component.html',
  styleUrl: './balance-sheet-table.component.scss'
})
export class BalanceSheetTableComponent implements OnInit {
  @Input() tableTitle!: string;
  @Input() tableData!: { assets: BalanceSheetEntry[], liabilities: BalanceSheetEntry[] };


  ngOnInit(): void {
      console.log(this.tableData);
      
  }

  protected editBalanceRecord(entry: BalanceSheetEntry) {
    console.log(entry);
  }
}
