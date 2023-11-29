import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UserState } from '../../store/user/userState.state';
import { BalanceSheetEntryBody } from '../../model/balanceSheet.model';
import { NewBsRecordComponent } from './new-bs-record/new-bs-record.component';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { BalanceSheetTableComponent } from './balance-sheet-table/balance-sheet-table.component';


@Component({
  selector: 'app-balance-sheet',
  standalone: true,
  imports: [CommonModule, NewBsRecordComponent, BalanceSheetTableComponent],
  templateUrl: './balance-sheet.component.html',
  styleUrl: './balance-sheet.component.scss'
})
export class BalanceSheetComponent implements OnInit {
  balanceSheetEntries$: Observable<any> = this.store.select((state) => state.user.balanceSheetEntries);
  assets: BalanceSheetEntryBody[] = [];
  liabilities: BalanceSheetEntryBody[] = [];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.balanceSheetEntries$.subscribe((entries: BalanceSheetEntryBody[]) => {
      entries.forEach((entry: BalanceSheetEntryBody) => {
        if (entry.type === 'asset') {
          this.assets.push(entry);
        }
        if (entry.type === 'liability') {
          this.liabilities.push(entry);
        }
      });
    },
      (error: any )=> console.log(error)
    );
  };
}
