import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewBsRecordComponent } from './new-bs-record/new-bs-record.component';
import { BalanceSheetTableComponent } from './balance-sheet-table/balance-sheet-table.component';
import { MonthNetAssetBannerComponent } from '../../shared/month-net-asset-banner/month-net-asset-banner.component';


@Component({
  selector: 'app-balance-sheet',
  standalone: true,
  imports: [CommonModule, NewBsRecordComponent, BalanceSheetTableComponent, MonthNetAssetBannerComponent],
  templateUrl: './balance-sheet.component.html',
  styleUrl: './balance-sheet.component.scss'
})
export class BalanceSheetComponent {

}
