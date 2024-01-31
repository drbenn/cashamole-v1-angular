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
import { Observable } from 'rxjs';
import { DashboardState } from '../../store/dashboard/dashboard.state';
import { DropdownModule } from 'primeng/dropdown';
import { IncomeHistoryComponent } from '../../dashboard-components/income-history/income-history.component';


export interface OptionType {
    type: string
}


@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, FormsModule, SelectButtonModule, DropdownModule, ChartOneComponent, AssetCompositionComponent, ExpenseCompositionComponent, ExpenseHistoryComponent, NetWorthTimeComponent, AssetVsLiabilityTimeComponent, LiabilityCompositionComponent, NetCashFlowTimeComponent, IncomeHistoryComponent]
})
export class HomeComponent implements OnInit {
    @Select(CalendarState.activeMonthStartDate) activeMonthStartDate$!: Observable<Date>;
    @Select(DashboardState.yearOptions) yearOptions$!: Observable<string[]>;
    @Select(DashboardState.selectedDashboardView) selectedView$!: Observable<'monthly' | 'annual' | 'all-time'>;
    @Select(DashboardState.activeYearMonthOptions) activeYearMonthOptions$!: Observable<string[]>;

    protected timeTypes: OptionType[] = [{ type: 'Y-T-D'}, { type: "Month"}, { type: "Annual"}, { type: "All"}];
    protected selectedTimeType: OptionType = this.timeTypes[3];
    protected monthNote: string = 'Select active month in navigation';
    protected isMonthActiveChoice: boolean = false;
    protected isYearActiveChoice: boolean = false;
    protected yearOptions: OptionType[] = [];
    protected monthOptions: OptionType[] = [];
    protected selectedAnnualYear!: OptionType;
    protected selectedMonthlyYear!: OptionType;
    protected selectedMonth!: OptionType;
    protected selectedView: 'monthly' | 'annual' | 'all-time' = 'all-time';

    constructor(
        private store: Store
    ) {}

    ngOnInit(): void {
        
        this.selectedView$.subscribe((type: 'monthly' | 'annual' | 'all-time') => this.selectedView = type);
        this.activeYearMonthOptions$.subscribe((months: string[]) => {
            if (months) {
                const monthTypes: OptionType[] = [];
                months.forEach((month: string) => monthTypes.push({ type: month }));
                this.monthOptions = monthTypes;
                // selected month must be dynamically updated dependent on months available
                if (!this.selectedMonth) {
                    this.selectedMonth = this.monthOptions[this.monthOptions.length - 1];
                } else {
                    const jok = this.monthOptions.findIndex((month: any) => month.type === this.selectedMonth.type)
                    const indexOfSelectedMonth = this.monthOptions.findIndex((month: any) => month.type === this.selectedMonth.type);
                    indexOfSelectedMonth === -1 ? this.selectedMonth = this.monthOptions[this.monthOptions.length - 1] : this.selectedMonth = this.selectedMonth;
                };
            };
        });

        this.yearOptions$.subscribe((years: string[]) => {
            if (years && years.length) {
                const yearTypes: OptionType[] = [];
                years.forEach((year: string) => yearTypes.push({ type: year }));
                this.yearOptions = yearTypes;
                this.selectedAnnualYear = this.yearOptions[0];
                this.selectedMonthlyYear = this.yearOptions[0];
                this.store.dispatch(new DashboardActions.SetActiveAnnualYearForDashboard(this.selectedAnnualYear.type));
                this.store.dispatch(new DashboardActions.SetActiveMonthlyYearForDashboard(this.selectedMonthlyYear.type));
            };
        }); 

        setTimeout(()=> {
            this.handleChartTimePeriodSelect({type: "All"}), 300
        });
    };

    protected handleChartTimePeriodSelect(item: { type: 'Y-T-D' | 'Month' | 'Annual' | 'All' }): void {
        let dataView: { type: 'monthly' | 'annual' | 'all-time' | null, year: string | null, month: string | null } = {type: null, year: null, month: null };
        
        if (item.type === 'Month') {
            dataView = {type: 'monthly', year: this.selectedMonthlyYear.type, month: this.selectedMonth.type };
            this.isMonthActiveChoice = true;
        } else {
            this.isMonthActiveChoice = false;
        };

        if (item.type === 'Annual') {
            dataView = {type: 'annual', year: this.selectedAnnualYear.type, month: null };
            this.isYearActiveChoice = true;
        } else {
            this.isYearActiveChoice = false;
        };

        if (item.type === 'Y-T-D') {
            dataView = {type: 'annual', year: this.selectedAnnualYear.type, month: null };
            this.isMonthActiveChoice = false;
            this.isYearActiveChoice = false;
        }; 

        if (item.type === 'All') {
            dataView = {type: 'all-time', year: null, month: null };
            this.isMonthActiveChoice = false;
            this.isYearActiveChoice = false;
        };
        // console.log(dataView);
        this.store.dispatch(new DashboardActions.FilterDataForSelectedTimePeriodView(dataView))
    };

    protected handleAnnualYearDropdownChange() {
        this.store.dispatch(new DashboardActions.SetActiveAnnualYearForDashboard(this.selectedAnnualYear.type));
        this.handleChartTimePeriodSelect({ type: 'Annual'});
    };

    protected handleMonthlyYearDropdownChange() {
        this.store.dispatch(new DashboardActions.SetActiveAnnualYearForDashboard(this.selectedMonthlyYear.type));
        this.handleChartTimePeriodSelect({ type: 'Month'});
    };

    protected handlMonthlyMonthDropdownChange() {
        this.handleChartTimePeriodSelect({ type: 'Month'});  
    };

}
