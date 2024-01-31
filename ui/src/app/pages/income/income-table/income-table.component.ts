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
import { Income } from '../../../models/core.model';
import { IncomeActions } from '../../../store/income/income.actions';
import {CardModule} from 'primeng/card';

@Component({
  selector: 'app-income-table',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule, CalendarModule, InputTextModule, InputNumberModule, TooltipModule, CardModule],
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
  };

  protected onRowEditCancel(product: any, index: number): void {
  };


  protected onRowEditSave(income: Income): void {
    this.coreApi.submitUpdatedIncomeRecord(income).pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          this.store.dispatch(new IncomeActions.EditIncomeRecord(income));
        },
        error: (error: Error) => {
          console.error(error);
        }
      }
    );
  };

  protected removeEntry(income: Income, index: number): void {
    if (income.inc_id) {
      this.coreApi.deactivateIncomeRecord(income?.inc_id).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            this.store.dispatch(new IncomeActions.DeactivateUserIncomeRecord(income));
          },
          error: (error: Error) => {
            console.error(error);
          }
        }
      );
    };
  };

}
