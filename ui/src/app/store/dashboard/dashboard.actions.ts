import { DashboardHistoryData } from "../../models/core.model";

export namespace DashboardActions {

    export class SetDashboardHistoryOnLogin {
        static readonly type =  '[Dashboard] Set history on login';
        constructor(public payload: DashboardHistoryData) {}
    };

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