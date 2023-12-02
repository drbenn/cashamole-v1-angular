import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewBsRecordComponent } from './new-bs-record/new-bs-record.component';
import { BalanceSheetTableComponent } from './balance-sheet-table/balance-sheet-table.component';



@Component({
  selector: 'app-balance-sheet',
  standalone: true,
  imports: [CommonModule, NewBsRecordComponent, BalanceSheetTableComponent],
  templateUrl: './balance-sheet.component.html',
  styleUrl: './balance-sheet.component.scss'
})
export class BalanceSheetComponent {

}
