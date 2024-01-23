import { DashboardHistoryData } from "../../models/core.model";

export namespace DashboardActions {

    export class SetDashboardHistoryOnLogin {
        static readonly type =  '[Dashboard] Set history on login';
        constructor(public payload: DashboardHistoryData) {}
    };
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

    export class SetDashboardAnnualFilter {
        static readonly type =  '[Dashboard] Set dashboard filters for specific year';
        constructor(public payload: any) {}
    };

    export class SetDashboardMonthFilter {
        static readonly type =  '[Dashboard] Set dashboard filters for specific month/year';
        constructor(public payload: any) {}
    };

    export class SetDashboardAllTimeFilter {
        static readonly type =  '[Dashboard] Set dashboard filters for all user data';
    };
    

    
}