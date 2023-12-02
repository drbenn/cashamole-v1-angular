import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceSheetComponent } from '../balance-sheet/balance-sheet.component';
import { TransactionsComponent } from '../transactions/transactions.component';
import { ChartOneComponent } from '../viz/chart-one/chart-one.component';



@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, BalanceSheetComponent, TransactionsComponent, ChartOneComponent]
})
export class HomeComponent {

}
