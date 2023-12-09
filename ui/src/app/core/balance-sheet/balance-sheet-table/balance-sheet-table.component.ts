import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { BalanceSheetEntry } from '../../../model/core.model';
import { CalendarState } from '../../../store/calendar/calendar.state';
import { DateRange } from '../../../model/calendar.model';


@Component({
  selector: 'app-balance-sheet-table',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule],
  templateUrl: './balance-sheet-table.component.html',
  styleUrl: './balance-sheet-table.component.scss'
})
export class BalanceSheetTableComponent implements OnInit {
  @Select(CalendarState.activeMonthDateRange) activeMonthDateRange$!: Observable<DateRange>;
  activeMonthDateRange!: DateRange;
  protected balanceSheetData$: Observable<BalanceSheetEntry[]> = this.store.select((state) => state.balanceSheet.entries);
  private allBalanceSheetEntries!: BalanceSheetEntry[];
  protected balanceSheet: { assets: BalanceSheetEntry[], liabilities: BalanceSheetEntry[] } = {
    assets: [],
    liabilities: []
  };

  constructor(
    private store: Store
  ) {}

  ngOnInit(): void {
    this.activeMonthDateRange$.subscribe((dateRange: DateRange) => {
      if (dateRange) {
        this.activeMonthDateRange = dateRange;
      };
      if (dateRange && this.allBalanceSheetEntries) {
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
    console.log('in filter entries to active month');
    console.log(entries);
    
    const monthEntries = entries.filter((entry: BalanceSheetEntry) => {
      console.log(entry);
      console.log(typeof entry.date);
      console.log(typeof dateRange.startDate);
      
      
      console.log('startdate: ',dateRange.startDate);
      
      console.log(new Date(entry.date) >= dateRange.startDate);
      
      console.log('enddate: ',dateRange.endDate);
      console.log(new Date(entry.date) <= dateRange.endDate);
      
      return new Date(entry.date) >= dateRange.startDate && new Date(entry.date) <= dateRange.endDate;
    });
    console.log(monthEntries);
    
    this.balanceSheet = {
      assets: [],
      liabilities: []
    };
    monthEntries.forEach((entry: BalanceSheetEntry) => {
      if (entry.type === 'asset') {
        this.balanceSheet.assets.push(entry);
      } else if (entry.type === 'liability') {
        this.balanceSheet.liabilities.push(entry);
      };
    });
  };

  protected editBalanceRecord(entry: BalanceSheetEntry) {
    console.log(entry);
  };
}
