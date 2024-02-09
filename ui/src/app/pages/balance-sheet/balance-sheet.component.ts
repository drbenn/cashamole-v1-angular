import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewBsRecordComponent } from './new-bs-record/new-bs-record.component';
import { BalanceSheetTableComponent } from './balance-sheet-table/balance-sheet-table.component';
import { MonthNetWorthSummaryComponent } from "../../dashboard-components/month-net-worth-summary/month-net-worth-summary.component";
import { ProgressSpinnerComponent } from '../../shared/progress-spinner/progress-spinner.component';



@Component({
    selector: 'app-balance-sheet',
    standalone: true,
    templateUrl: './balance-sheet.component.html',
    styleUrl: './balance-sheet.component.scss',
    imports: [CommonModule, NewBsRecordComponent, BalanceSheetTableComponent, MonthNetWorthSummaryComponent, ProgressSpinnerComponent]
})
export class BalanceSheetComponent {

}
