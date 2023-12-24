import { BalanceSheetEntry } from "../../model/core.model";

export namespace BalanceSheetActions {

    export class SetBalanceSheetEntriesOnLogin {
        static readonly type =  '[Balance Sheet] Set entries on login';
        constructor(public payload: any) {}
    };

    export class GetAndSetMonthBalanceRecords {
        static readonly type =  '[Balance Sheet] Get and set entries on month change';
        constructor(public payload: string) {}
    };

    export class AddUserBalanceRecord {
        static readonly type =  '[Balance Sheet] Add user balance record';
        constructor(public payload: BalanceSheetEntry) {}
    };

    export class EditUserBalanceRecord {
        static readonly type =  '[Balance Sheet] Edit user balance record';
        constructor(public payload: BalanceSheetEntry) {}
    };

    export class DeactivateUserBalanceRecord {
        static readonly type =  '[Balance Sheet] Deactivate user balance record';
        constructor(public payload: BalanceSheetEntry) {}
    };
}