import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Observable, first, take } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { CalendarState } from '../../../store/calendar/calendar.state';
import { DateRange } from '../../../model/calendar.model';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { BalancSheetActions } from '../../../store/balanceSheet/bsState.actions';
import { CoreApiService } from '../../../shared/api/core-api.service';
import { TooltipModule } from 'primeng/tooltip';
import { Income } from '../../../model/core.model';
import { IncomeActions } from '../../../store/income/income.actions';

@Component({
  selector: 'app-income-table',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule, CalendarModule, InputTextModule, InputNumberModule, TooltipModule],
  templateUrl: './income-table.component.html',
  styleUrl: './income-table.component.scss'
})
export class IncomeTableComponent implements OnInit {
  @Input() tableTitle!: string;
  @Input() tableData!: Income[];

  constructor(
    private store: Store,
    private coreApi: CoreApiService
  ) {}

  ngOnInit(): void {

  
  }

  protected onRowEditInit(row: any): void {
    console.log('ONROW EDIT');
    console.log(row);

  };

  protected onRowEditSave(income: Income): void {
    console.log('edit income recrod');
    console.log(income);
    this.coreApi.submitUpdatedIncomeRecord(income).pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          console.log(value);
          this.store.dispatch(new IncomeActions.EditIncomeRecord(income));
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

  protected removeEntry(income: Income, index: number): void {
    console.log('remove income entry');
    console.log(income);
    
    
    if (income.inc_id) {
      this.coreApi.deactivateIncomeRecord(income?.inc_id).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            console.log(value);
            this.store.dispatch(new IncomeActions.DeactivateUserIncomeRecord(income));
          },
          error: (error: any) => {
            console.error(error);
          }
        }
      );
    };
  };

  // protected editIncomeRecord(income: Income) {
  //   console.log(income);
  // }
}
