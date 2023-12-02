import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { NewBsRecordComponent } from './new-bs-record/new-bs-record.component';
import { BalanceSheetTableComponent } from './balance-sheet-table/balance-sheet-table.component';
import { BalanceSheetEntry } from '../../model/models.model';


@Component({
  selector: 'app-balance-sheet',
  standalone: true,
  imports: [CommonModule, NewBsRecordComponent, BalanceSheetTableComponent],
  templateUrl: './balance-sheet.component.html',
  styleUrl: './balance-sheet.component.scss'
})
export class BalanceSheetComponent implements OnInit {
  balanceSheetEntries$: Observable<any> = this.store.select((state) => state.user.balanceSheetEntries);
  balanceSheet: { assets: BalanceSheetEntry[], liabilities: BalanceSheetEntry[] } = {
    assets: [],
    liabilities: []
  }

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.balanceSheetEntries$.subscribe((entries: BalanceSheetEntry[]) => {
      console.log(entries);
      
      if (entries) {
        entries.forEach((entry: BalanceSheetEntry) => {
          if (entry.type === 'asset') {
            this.balanceSheet.assets.push(entry);
          }
          if (entry.type === 'liability') {
            this.balanceSheet.liabilities.push(entry);
          }
        });
      }
    },
      (error: any )=> console.log(error)
    );
  };
}
