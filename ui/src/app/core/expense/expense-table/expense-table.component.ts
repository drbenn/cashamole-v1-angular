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
import { Expense } from '../../../model/core.model';
import { ExpenseActions } from '../../../store/expense/expese.actions';


@Component({
  selector: 'app-expense-table',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule, CalendarModule, InputTextModule, InputNumberModule, TooltipModule],
  templateUrl: './expense-table.component.html',
  styleUrl: './expense-table.component.scss'
})
export class ExpenseTableComponent implements OnInit {
  @Input() tableTitle!: string;
  @Input() tableData!: Expense[];

  constructor(
    private store: Store,
    private coreApi: CoreApiService
  ) {}

  ngOnInit(): void {
    
  };

  // protected editTransactionRecord(expense: Expense) {
  //   console.log(expense);
  // };

  protected onRowEditInit(row: any): void {
    console.log('ONROW EDIT');
    console.log(row);

  };

  protected onRowEditSave(expense: Expense): void {
    console.log('edit expense recrod');
    console.log(expense);
    this.coreApi.submitUpdatedExpenseRecord(expense).pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          console.log(value);
          this.store.dispatch(new ExpenseActions.EditUserExpenseRecord(expense));
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

  protected removeEntry(expense: Expense, index: number): void {
    console.log('remove expense entry');
    console.log(expense);
    
    
    if (expense.exp_id) {
      this.coreApi.deactivatExpenseRecord(expense?.exp_id).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            console.log(value);
            this.store.dispatch(new ExpenseActions.DeactivateUserExpenseRecord(expense));
          },
          error: (error: any) => {
            console.error(error);
          }
        }
      );
    };
  };
}



