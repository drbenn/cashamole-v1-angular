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
import { Invest } from '../../../models/core.model';
import { InvestActions } from '../../../store/invest/invest.actions';
import {CardModule} from 'primeng/card';

@Component({
  selector: 'app-invest-table',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule, CalendarModule, InputTextModule, InputNumberModule, TooltipModule, CardModule],
  templateUrl: './invest-table.component.html',
  styleUrl: './invest-table.component.scss'
})
export class InvestTableComponent implements OnInit {
  @Input() tableTitle!: string;
  @Input() tableData!: Invest[];

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

  protected onRowEditSave(invest: Invest): void {
    console.log('edit invest');
    console.log(invest);
    
    
    this.coreApi.submitUpdatedInvestRecord(invest).pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          this.store.dispatch(new InvestActions.EditInvestRecord(invest));
        },
        error: (error: any) => {
          console.error(error);
        }
      }
    );
  };

  protected removeEntry(invest: Invest, index: number): void {
    console.log('remove invest');
    console.log(invest);
    if (invest.inv_id) {
      this.coreApi.deactivateInvestRecord(invest?.inv_id).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            this.store.dispatch(new InvestActions.DeactivateUserInvestRecord(invest));
          },
          error: (error: any) => {
            console.error(error);
          }
        }
      );
    };
  };

}
