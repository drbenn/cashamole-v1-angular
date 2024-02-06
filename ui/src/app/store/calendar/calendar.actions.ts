import { DateRange } from "../../models/calendar.model";
import { MonthRecordsResponse } from "../../models/core.model";

export namespace CalendarActions {

    export class SetCalendarOnLogin {
        static readonly type =  '[Calendar] Set current month time period on login';
    }

    export class ChangeCalendarMonth {
        static readonly type =  '[Calendar] Change calendar range';
        constructor(public payload: DateRange) {}
    }

    export class GetAllRecordsForMonth {
        static readonly type =  '[Calendar] Get all month records for user transaction view/edit';
        constructor(public yearMonthId: string) {}
    }

    export class SetAllRecordsForMonth {
        static readonly type =  '[Calendar] Set all retreieved month records for user transaction view/edit';
        constructor(public monthRecords: MonthRecordsResponse) {}
    }

}