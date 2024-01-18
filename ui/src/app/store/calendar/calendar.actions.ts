import { DateRange } from "../../models/calendar.model";

export namespace CalendarActions {

    export class SetCalendarOnLogin {
        static readonly type =  '[Calendar] Set current month time period on login';
    }

    export class ChangeCalendarMonth {
        static readonly type =  '[Calendar] Change calendar range';
        constructor(public payload: DateRange) {}
    }

    export class SetMinDateRange {
        static readonly type =  '[Calendar] Set date range of earliest transaction/balance sheet ';
        constructor(public payload: any) {}
    }
}