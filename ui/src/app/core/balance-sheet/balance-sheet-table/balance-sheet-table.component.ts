import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { BalanceSheetEntry } from '../../../model/core.model';
import { CalendarState } from '../../../store/calendar/calendar.state';
import { DateRange } from '../../../model/calendar.model';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

// DropdownModule,
// InputTextModule,
// InputNumberModule,
// ButtonModule,


@Component({
  selector: 'app-balance-sheet-table',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule, FormsModule, CalendarModule, InputTextModule, InputNumberModule],
  templateUrl: './balance-sheet-table.component.html',
  styleUrl: './balance-sheet-table.component.scss'
})
export class BalanceSheetTableComponent implements OnInit {
  @Select(CalendarState.activeMonthDateRange) activeMonthDateRange$!: Observable<DateRange>;
  activeMonthDateRange!: DateRange;
  protected balanceSheetData$: Observable<BalanceSheetEntry[]> = this.store.select((state) => state.balanceSheet.entries);
  private allBalanceSheetEntries!: BalanceSheetEntry[];
  protected assets: BalanceSheetEntry[] = [];
  protected liabilities: BalanceSheetEntry[] = [];

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

onRowEditInit(product: any) {
  console.log('ONROW EDIT');
  console.log(product);
  
  
    // this.clonedProducts[product.id as string] = { ...product };
}

onRowEditSave(product: any) {
  console.log('ONROW EDIT SAVE');
  console.log(product);
    // if (product.price > 0) {
    //     delete this.clonedProducts[product.id as string];
    //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
    // } else {
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    // }
}

onRowEditCancel(product: any, index: number) {
  console.log('ONROW EDIT Cancel');
  console.log(product);
    // this.products[index] = this.clonedProducts[product.id as string];
    // delete this.clonedProducts[product.id as string];
}

removeEntry(product: any, index: number) {
  console.log('REmove entry');
  console.log(product);
    // this.products[index] = this.clonedProducts[product.id as string];
    // delete this.clonedProducts[product.id as string];
}

  protected editBalanceRecord(entry: BalanceSheetEntry) {
    console.log(entry);
  };
}
