import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { Expense } from '../../../model/core.model';

@Component({
  selector: 'app-expense-table',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule],
  templateUrl: './expense-table.component.html',
  styleUrl: './expense-table.component.scss'
})
export class ExpenseTableComponent implements OnInit {
  @Input() tableTitle!: string;
  @Input() tableData!: Expense[];

  ngOnInit(): void {
    
  };

  protected editTransactionRecord(expense: Expense) {
    console.log(expense);
  };
}

// @Input() tableTitle!: string;
// @Input() tableData!: Expense[];
// @Select(CalendarState.activeMonthDateRange) activeMonthDateRange$!: Observable<DateRange>;
// activeMonthDateRange!: DateRange;
// // protected balanceSheetData$: Observable<Expense[]> = this.store.select((state: any) => state.expense.entries);
// // private allBalanceSheetEntries!: Expense[];
// // protected assets: Expense[] = [];
// // protected liabilities: Expense[] = [];

// constructor(
//   private store: Store,
//   private coreApi: CoreApiService
// ) {}

// ngOnInit(): void {
//   this.activeMonthDateRange$.subscribe((dateRange: DateRange) => {
//     if (dateRange) {
//       this.activeMonthDateRange = dateRange;
//     };
//     if (dateRange && this.tableData) {
//       this.resetTableData();
//       this.filterEntriesToActiveMonth(this.tableData, this.activeMonthDateRange);
//     };
//   });
//   this.balanceSheetData$.subscribe((data: Expense[]) => {     
//     if (data) {
//       this.allBalanceSheetEntries = data;
//     };
//     if (data && this.activeMonthDateRange) {
//       this.filterEntriesToActiveMonth(data, this.activeMonthDateRange);
//     };
//   });
// };

// private filterIncomeToActiveMonth(entries: BalanceSheetEntry[], dateRange: DateRange): void {   
//   const monthEntries = entries.filter((entry: BalanceSheetEntry) => {      
//     return new Date(entry.date) >= dateRange.startDate && new Date(entry.date) <= dateRange.endDate;
//   });
 
//   monthEntries.forEach((entry: BalanceSheetEntry) => {
//     if (entry.type === 'asset') {
//       this.assets.push(entry);
//     } else if (entry.type === 'liability') {
//       this.liabilities.push(entry);
//     };
//   });
// };

// private resetTableData(): void {
//   this.assets = [];
//   this.liabilities = [];
// };

// protected onRowEditInit(row: any): void {
//   console.log('ONROW EDIT');
//   console.log(row);

// };

// protected onRowEditSave(balanceSheetEntry: BalanceSheetEntry): void {
//   console.log('edit bs recrod');
//   console.log(balanceSheetEntry);
//   this.coreApi.submitUpdatedBsRecord(balanceSheetEntry).pipe(take(1), first())
//   .subscribe(
//     {
//       next: (value: any) => {
//         console.log(value);
//         this.store.dispatch(new BalancSheetActions.EditUserBalanceRecord(balanceSheetEntry));
//       },
//       error: (error: any) => {
//         console.error(error);
//       }
//     }
//   );
// };

// protected onRowEditCancel(product: any, index: number): void {
//   console.log('ONROW EDIT Cancel');
//   console.log(product);
// };

// protected removeEntry(balanceSheetEntry: BalanceSheetEntry, index: number): void {
//   console.log('remove bs entry');
//   console.log(balanceSheetEntry);
  
  
//   if (balanceSheetEntry.record_id) {
//     this.coreApi.deactivateBsRecord(balanceSheetEntry?.record_id).pipe(take(1), first())
//     .subscribe(
//       {
//         next: (value: any) => {
//           console.log(value);
//           this.store.dispatch(new BalancSheetActions.DeactivateUserBalanceRecord(balanceSheetEntry));
//         },
//         error: (error: any) => {
//           console.error(error);
//         }
//       }
//     );
//   } else {
//     this.store.dispatch(new BalancSheetActions.DeactivateUserBalanceRecord(balanceSheetEntry));
//   };
// };

// }

