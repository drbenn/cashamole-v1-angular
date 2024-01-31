import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { first, take } from 'rxjs';
import { Store } from '@ngxs/store';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CoreApiService } from '../../../api-services/core-api.service';
import { TooltipModule } from 'primeng/tooltip';
import { Expense } from '../../../models/core.model';
import { ExpenseActions } from '../../../store/expense/expense.actions';
import {CardModule} from 'primeng/card';


@Component({
  selector: 'app-expense-table',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule, CalendarModule, InputTextModule, InputNumberModule, TooltipModule, CardModule],
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

  protected onRowEditInit(row: any): void {
  };

  protected onRowEditCancel(product: any, index: number): void {
  };

  protected onRowEditSave(expense: Expense): void {
    this.coreApi.submitUpdatedExpenseRecord(expense).pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          this.store.dispatch(new ExpenseActions.EditUserExpenseRecord(expense));
        },
        error: (error: Error) => {
          console.error(error);
        }
      }
    );
  };

  protected removeEntry(expense: Expense, index: number): void {
    if (expense.exp_id) {
      this.coreApi.deactivatExpenseRecord(expense?.exp_id).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            this.store.dispatch(new ExpenseActions.DeactivateUserExpenseRecord(expense));
          },
          error: (error: Error) => {
            console.error(error);
          }
        }
      );
    };
  };
}



