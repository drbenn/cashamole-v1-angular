import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Observable, first, take } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { BalanceSheetEntry } from '../../../models/core.model';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { BalanceSheetActions } from '../../../store/balanceSheet/bsState.actions';
import { CoreApiService } from '../../../api-services/core-api.service';
import { TooltipModule } from 'primeng/tooltip';
import {CardModule} from 'primeng/card';
import { CalendarState } from '../../../store/calendar/calendar.state';


@Component({
  selector: 'app-balance-sheet-table',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule, CalendarModule, InputTextModule, InputNumberModule, TooltipModule, CardModule],
  templateUrl: './balance-sheet-table.component.html',
  styleUrl: './balance-sheet-table.component.scss'
})
export class BalanceSheetTableComponent implements OnInit {
  @Select(CalendarState.activeMonthStartDate) activeMonthStartDate$!: Observable<Date>;
  protected activeMonthStartDate!: Date ;
  protected balanceSheetData$: Observable<BalanceSheetEntry[]> = this.store.select((state: any) => state.balanceSheet.entries);
  protected assets: BalanceSheetEntry[] = [];
  protected liabilities: BalanceSheetEntry[] = [];
  protected subheader: string = '';

  constructor(
    private store: Store,
    private coreApi: CoreApiService
  ) {}

  ngOnInit(): void {
    this.activeMonthStartDate$.subscribe((startDate: Date) => {      
      this.activeMonthStartDate = startDate;
      const activeMonth: string = startDate.toLocaleString(undefined, { month: 'short' });
      const fullyear: string = startDate.getFullYear().toString();
      this.subheader = `as of  ${activeMonth} 1, ${fullyear}`;
    })
    this.balanceSheetData$.subscribe((data: BalanceSheetEntry[]) => {     
      if (data) {
        console.log(data);
        
        this.resetTableData();  
        this.setMonthEntriesToBsType(data);
      };
    });
  };

  private setMonthEntriesToBsType(entries: BalanceSheetEntry[]): void {
    entries.forEach((entry: BalanceSheetEntry) => {
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
  };
  
  protected onRowEditCancel(product: any, index: number): void {
  };

  protected onRowEditSave(balanceSheetEntry: BalanceSheetEntry): void {
    this.coreApi.submitUpdatedBsRecord(balanceSheetEntry).pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          this.store.dispatch(new BalanceSheetActions.EditUserBalanceRecord(balanceSheetEntry));
        },
        error: (error: any) => {
          console.error(error);
        }
      }
    );
  };

  protected removeEntry(balanceSheetEntry: BalanceSheetEntry, index: number): void {
    if (balanceSheetEntry.record_id) {
      this.coreApi.deactivateBsRecord(balanceSheetEntry?.record_id).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            this.store.dispatch(new BalanceSheetActions.DeactivateUserBalanceRecord(balanceSheetEntry));
          },
          error: (error: any) => {
            console.error(error);
          }
        }
      );
    };
  };

}
