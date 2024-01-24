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
        static readonly type =  '[Dashboard] Set dashboard filters for annual display';
        constructor(public payload: any) {}
    };

    export class SetDashboardMonthFilter {
        static readonly type =  '[Dashboard] Set dashboard filters for month display';
        constructor(public payload: any) {}
    };

    export class SetDashboardAllTimeFilter {
        static readonly type =  '[Dashboard] Set dashboard filters for all-time user data';
    };

    export class SetMonthExpensesForDashboard {
        static readonly type =  '[Dashboard] Set dashboard filters for month expenses';
        constructor(public payload: any) {}
    };

    export class SetMonthIncomeForDashboard {
        static readonly type =  '[Dashboard] Set dashboard filters for month income';
        constructor(public payload: any) {}
    };

    export class SetMonthInvestmentsForDashboard {
        static readonly type =  '[Dashboard] Set dashboard filters for month investments';
        constructor(public payload: any) {}
    };

    export class SetMonthBalancesForDashboard {
        static readonly type =  '[Dashboard] Set dashboard filters for month balances';
        constructor(public payload: any) {}
    };

    // export class SetYTDExpensesForDashboardOnLogin {
    //     static readonly type =  '[Dashboard] Set dashboard filters for YTD expenses on login';
    //     constructor(public payload: any) {}
    // };

    // export class SetYTDIncomeForDashboardOnLogin {
    //     static readonly type =  '[Dashboard] Set dashboard filters for YTD income on login';
    //     constructor(public payload: any) {}
    // };

    // export class SetYTDInvestmentsForDashboardOnLogin {
    //     static readonly type =  '[Dashboard] Set dashboard filters for YTD investments on login';
    //     constructor(public payload: any) {}
    // };

    // export class SetMYTDBalancesForDashboardOnLogin {
    //     static readonly type =  '[Dashboard] Set dashboard filters for YTD balances on login';
    //     constructor(public payload: any) {}
    // };
    

    
}