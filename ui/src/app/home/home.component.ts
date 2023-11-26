import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceSheetComponent } from '../core/balance-sheet/balance-sheet.component';
import { TransactionsComponent } from '../core/transactions/transactions.component';


@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, BalanceSheetComponent, TransactionsComponent]
})
export class HomeComponent {

}
