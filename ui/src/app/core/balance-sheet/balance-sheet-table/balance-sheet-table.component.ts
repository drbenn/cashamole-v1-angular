import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { BalanceSheetEntry } from '../../../model/core.model';


@Component({
  selector: 'app-balance-sheet-table',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule],
  templateUrl: './balance-sheet-table.component.html',
  styleUrl: './balance-sheet-table.component.scss'
})
export class BalanceSheetTableComponent implements OnInit {
  protected balanceSheetData$: Observable<BalanceSheetEntry[]> = this.store.select((state) => state.balanceSheet.entries);
  protected balanceSheet: { assets: BalanceSheetEntry[], liabilities: BalanceSheetEntry[] } = {
    assets: [],
    liabilities: []
  };

  constructor(
    private store: Store
  ) {}

  ngOnInit(): void {
    this.balanceSheetData$.subscribe((data: BalanceSheetEntry[]) => {
      if (data) {
        this.balanceSheet = {
          assets: [],
          liabilities: []
        };
        data.forEach((entry: BalanceSheetEntry) => {
          if (entry.type === 'asset') {
            this.balanceSheet.assets.push(entry);
          }
          if (entry.type === 'liability') {
            this.balanceSheet.liabilities.push(entry);
          }
        });
      }
    })
      
  }

  protected editBalanceRecord(entry: BalanceSheetEntry) {
    console.log(entry);
  }
}
