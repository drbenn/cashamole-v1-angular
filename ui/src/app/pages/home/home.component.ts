import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartOneComponent } from '../../viz/chart-one/chart-one.component';
import { AssetCompositionComponent } from "../../dashboard-components/asset-composition/asset-composition.component";
import { ExpenseCompositionComponent } from "../../dashboard-components/expense-composition/expense-composition.component";
import { ExpenseHistoryComponent } from "../../dashboard-components/expense-history/expense-history.component";
import { NetWorthTimeComponent } from "../../dashboard-components/net-worth-time/net-worth-time.component";
import { AssetVsLiabilityTimeComponent } from "../../dashboard-components/asset-vs-liability-time/asset-vs-liability-time.component";
import { LiabilityCompositionComponent } from "../../dashboard-components/liability-composition/liability-composition.component";
import { NetCashFlowTimeComponent } from "../../dashboard-components/net-cash-flow-time/net-cash-flow-time.component";





@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, ChartOneComponent, AssetCompositionComponent, ExpenseCompositionComponent, ExpenseHistoryComponent, NetWorthTimeComponent, AssetVsLiabilityTimeComponent, LiabilityCompositionComponent, NetCashFlowTimeComponent]
})
export class HomeComponent {

}
