import { DashboardHistoryData } from "../../models/core.model";

export namespace DashboardActions {

    export class SetDashboardHistoryOnLogin {
        static readonly type =  '[Dashboard] Set history on login';
        constructor(public payload: DashboardHistoryData) {}
    };

    /////////////////////////////////////////////////////////////////////
    //      Actions For Updating Summaries in Input Pages
    /////////////////////////////////////////////////////////////////////
    export class UpdateMonthExpenseTotal {
        static readonly type =  '[Dashboard] Update expense month total';
        constructor(public payload: any) {}
    };

    export class UpdateMonthIncomeTotal {
        static readonly type =  '[Dashboard] Update income month total';
        constructor(public payload: any) {}
    };

    export class UpdateMonthInvestTotal {
        static readonly type =  '[Dashboard] Update invest month total';
        constructor(public payload: any) {}
    };

    export class UpdateMonthBalanceSheetTotal {
        static readonly type =  '[Dashboard] Update balance sheet month total';
        constructor(public payload: any) {}
    };


    /////////////////////////////////////////////////////////////////////
    //      Actions For Chart Dashboard Data
    /////////////////////////////////////////////////////////////////////
    export class SetActiveAnnualYearForDashboard {
        static readonly type =  '[Dashboard] Set dashboard active annual year for state side filtering';
        constructor(public payload: string) {}
    };

    export class SetActiveMonthlyYearForDashboard {
        static readonly type =  '[Dashboard] Set dashboard active monthly year for state side filtering';
        constructor(public payload: string) {}
    };

    export class SetActiveMonthlyMonthForDashboard {
        static readonly type =  '[Dashboard] Set dashboard active monthly month for state side filtering';
        constructor(public payload: string) {}
    };

    export class FilterDataForSelectedTimePeriodView {
        static readonly type =  '[Dashboard] Filter dashboard data to accomodate active view';
        constructor(public payload: { type: 'monthly' | 'annual' | 'all-time' | null, year: string | null, month: string | null } ) {}
    };

}