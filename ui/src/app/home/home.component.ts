import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTransactionComponent } from "../core/transactions/new-transaction/new-transaction.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, NewTransactionComponent]
})
export class HomeComponent {

}
