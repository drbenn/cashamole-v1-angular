import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartOneComponent } from '../../viz/chart-one/chart-one.component';
import { AssetCompositionComponent } from "../../dashboard-components/asset-composition/asset-composition.component";
import { ExpenseCompositionComponent } from "../../dashboard-components/expense-composition/expense-composition.component";
import { ExpenseHistoryComponent } from "../../dashboard-components/expense-history/expense-history.component";
import { NetWorthTimeComponent } from "../../dashboard-components/net-worth-time/net-worth-time.component";
import { AssetVsLiabilityTimeComponent } from "../../dashboard-components/asset-vs-liability-time/asset-vs-liability-time.component";
import { LiabilityCompositionComponent } from "../../dashboard-components/liability-composition/liability-composition.component";
import { NetCashFlowTimeComponent } from "../../dashboard-components/net-cash-flow-time/net-cash-flow-time.component";
import { SelectButtonModule } from 'primeng/selectbutton';
import { DashboardActions } from '../../store/dashboard/dashboard.actions';
import { FormsModule } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { CalendarState } from '../../store/calendar/calendar.state';
import { Observable, first, take } from 'rxjs';
import { DashboardState } from '../../store/dashboard/dashboard.state';
import { DropdownModule } from 'primeng/dropdown';


export interface OptionType {
    type: string
}


@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, FormsModule, SelectButtonModule, DropdownModule, ChartOneComponent, AssetCompositionComponent, ExpenseCompositionComponent, ExpenseHistoryComponent, NetWorthTimeComponent, AssetVsLiabilityTimeComponent, LiabilityCompositionComponent, NetCashFlowTimeComponent]
})
export class HomeComponent implements OnInit {
    @Select(CalendarState.activeMonthStartDate) activeMonthStartDate$!: Observable<Date>;
    @Select(DashboardState.yearOptions) yearOptions$!: Observable<string[]>;
    protected timeTypes: OptionType[] = [{ type: 'Y-T-D'}, { type: "Month"}, { type: "Annual"}, { type: "All"}];
    protected selectedTimeType: OptionType = this.timeTypes[3];
    protected monthNote: string = 'Select active month in navigation';
    protected isMonthActiveChoice: boolean = false;
    protected isYearActiveChoice: boolean = false;
    protected yearTypes: OptionType[] = [];
    protected selectedYear!: OptionType;

    private monthOnlyMonth!: string;
    private monthOnlyYear!: string;

    constructor(
        private store: Store
    ) {}

    ngOnInit(): void {
        this.activeMonthStartDate$.subscribe((startDate: Date) => {      
            const activeMonth: string = startDate.toLocaleString(undefined, { month: 'short' });
            const fullyear: string = startDate.getFullYear().toString();
            this.monthOnlyMonth = activeMonth;
            this.monthOnlyYear = fullyear;
        });
        this.yearOptions$.subscribe((years: string[]) => {
            if (years && years.length) {
                const yearTypes: OptionType[] = [];
                years.forEach((year: string) => yearTypes.push({ type: year }));
                this.yearTypes = yearTypes;
                this.selectedYear = this.yearTypes[0];
            };
        }); 
    };

    protected handleChartTimePeriodSelect(item: any): void {
        const type: 'Y-T-D' | 'Month' | 'Annual' | 'All' = item.type;
        if (item.type === 'Month') {
            this.store.dispatch(new DashboardActions.SetDashboardMonthFilter({ month: this.monthOnlyMonth, year: this.monthOnlyYear }));
            this.isMonthActiveChoice = true;
        } else {
            this.isMonthActiveChoice = false;
        };

        if (item.type === 'Annual') {
            this.isYearActiveChoice = true;
            console.log('annual item');
            console.log(item);
            
            
            this.store.dispatch(new DashboardActions.SetDashboardAnnualFilter(this.selectedYear.type));
        } else {
            this.isYearActiveChoice = false;
        };

        if (item.type === 'Y-T-D') {
            this.store.dispatch(new DashboardActions.SetDashboardAnnualFilter(this.yearTypes[0]));
        }; 

        if (item.type === 'All') {
            this.store.dispatch(new DashboardActions.SetDashboardAllTimeFilter());
        };   
    };

    protected handleAnnualYearDropdownChange() {
        console.log('in handle year change only');
        console.log(this.selectedYear);
        this.store.dispatch(new DashboardActions.SetDashboardAnnualFilter(this.selectedYear.type));
        
        
    }

}
