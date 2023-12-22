import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Observable, first, take } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { BalanceSheetEntry } from '../../../model/core.model';
import { CalendarState } from '../../../store/calendar/calendar.state';
import { DateRange } from '../../../model/calendar.model';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { BalancSheetActions } from '../../../store/balanceSheet/bsState.actions';
import { CoreApiService } from '../../../shared/api/core-api.service';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-balance-sheet-table',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule, CalendarModule, InputTextModule, InputNumberModule, TooltipModule],
  templateUrl: './balance-sheet-table.component.html',
  styleUrl: './balance-sheet-table.component.scss'
})
export class BalanceSheetTableComponent implements OnInit {
  @Select(CalendarState.activeMonthDateRange) activeMonthDateRange$!: Observable<DateRange>;
  activeMonthDateRange!: DateRange;
  protected balanceSheetData$: Observable<BalanceSheetEntry[]> = this.store.select((state: any) => state.balanceSheet.entries);
  private allBalanceSheetEntries!: BalanceSheetEntry[];
  protected assets: BalanceSheetEntry[] = [];
  protected liabilities: BalanceSheetEntry[] = [];

  constructor(
    private store: Store,
    private coreApi: CoreApiService
  ) {}

  ngOnInit(): void {
    this.activeMonthDateRange$.subscribe((dateRange: DateRange) => {
      if (dateRange) {
        this.activeMonthDateRange = dateRange;
      };
      if (dateRange && this.allBalanceSheetEntries) {
        this.resetTableData();
        this.filterEntriesToActiveMonth(this.allBalanceSheetEntries, this.activeMonthDateRange);
      };
    });
    this.balanceSheetData$.subscribe((data: BalanceSheetEntry[]) => {     
      if (data) {
        this.allBalanceSheetEntries = data;
      };
      if (data && this.activeMonthDateRange) {
        this.filterEntriesToActiveMonth(data, this.activeMonthDateRange);
      };
    });
  };

  private filterEntriesToActiveMonth(entries: BalanceSheetEntry[], dateRange: DateRange): void {   
    const monthEntries = entries.filter((entry: BalanceSheetEntry) => {      
      return new Date(entry.date) >= dateRange.startDate && new Date(entry.date) <= dateRange.endDate;
    });
   
    monthEntries.forEach((entry: BalanceSheetEntry) => {
      if (entry.type === 'asset') {
        this.assets.push(entry);
      } else if (entry.type === 'liability') {
        this.liabilities.push(entry);
      };
    });
  };

  private resetTableData(): void {
    this.assets = [];
    this.liabilities = [];
  };

  protected onRowEditInit(row: any): void {
    console.log('ONROW EDIT');
    console.log(row);

  };

  protected onRowEditSave(balanceSheetEntry: BalanceSheetEntry): void {
    console.log('edit bs recrod');
    console.log(balanceSheetEntry);
    this.coreApi.submitUpdatedBsRecord(balanceSheetEntry).pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          console.log(value);
          this.store.dispatch(new BalancSheetActions.EditUserBalanceRecord(balanceSheetEntry));
        },
        error: (error: any) => {
          console.error(error);
        }
      }
    );
  };

  protected onRowEditCancel(product: any, index: number): void {
    console.log('ONROW EDIT Cancel');
    console.log(product);
  };

  protected removeEntry(balanceSheetEntry: BalanceSheetEntry, index: number): void {
    console.log('remove bs entry');
    console.log(balanceSheetEntry);
    
    
    if (balanceSheetEntry.record_id) {
      this.coreApi.deactivateBsRecord(balanceSheetEntry?.record_id).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            console.log(value);
            this.store.dispatch(new BalancSheetActions.DeactivateUserBalanceRecord(balanceSheetEntry));
          },
          error: (error: any) => {
            console.error(error);
          }
        }
      );
    } else {
      this.store.dispatch(new BalancSheetActions.DeactivateUserBalanceRecord(balanceSheetEntry));
    };
  };

}
