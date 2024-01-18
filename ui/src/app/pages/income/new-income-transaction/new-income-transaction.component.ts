import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreApiService } from '../../../api-services/core-api.service';
import { Observable, first, take } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { Chip } from '../../../models/chips.model';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChipState } from '../../../store/chip/chipState.state';
import { ChipSelectComponent } from '../../../shared/chip-select/chip-select.component';
import { IncomeActions } from '../../../store/income/income.actions';
import { Income } from '../../../models/core.model';
import {CardModule} from 'primeng/card';


@Component({
  selector: 'app-new-income-transaction',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    CalendarModule,
    ChipSelectComponent,
    SelectButtonModule,
    CardModule
  ],
  templateUrl: './new-income-transaction.component.html',
  styleUrl: './new-income-transaction.component.scss'
})
export class NewIncomeTransactionComponent implements OnInit {
  @Select(ChipState.incomeSourceChips) incomeSourceChips$!: Observable<Chip[]>;
  protected incomeSourceChips: Chip[] = [];
  protected incomeSourceChipStrings: string[] = [];
  protected today: Date = new Date();

  protected newIncomeForm = this.fb.group({
    date: [ this.today, [Validators.required]],
    amount: [null as unknown as number, [Validators.required, Validators.min(-10000000), Validators.max(10000000)]],
    source: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(75)]],
    note: ['', [Validators.maxLength(100)]]
  });

  constructor (
    private fb: FormBuilder,
    private coreApi: CoreApiService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.today = new Date();
    this.incomeSourceChips$.subscribe((chips: Chip[]) => {
      if (chips) {
        this.setIncomeChips(chips);
      };
    });
  };

  private setIncomeChips(chips: Chip[]): void {
    this.incomeSourceChips = chips;
    this.incomeSourceChipStrings = [];
    chips.forEach((chip: Chip) => {
      this.incomeSourceChipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
    });
  };

  protected handleIncomeChipSelect(event: any): void  {
    this.newIncomeForm.get('source')?.setValue(event.chip);
  };

  protected clearForm(): void  {
    this.newIncomeForm.setValue({ 
      date: new Date(this.today),
      amount: null,
      source: '',
      note: ''
    });
    this.newIncomeForm.markAsPristine();
  };

  protected onSubmit(): void  {
    const values: any = this.newIncomeForm.value;
    
    if (!values) {
      return;
    }
    else if (values) {
      const incomeBody: Income = {
        date: new Date(values.date),
        amount: values.amount,
        source: values.source.toLowerCase(),
        note: values.note.toLowerCase(),
        status: 'active'
      }
      
      this.coreApi.submitNewIncomeRecord(incomeBody).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            // Updates state with new transaction / no need for full data pull on db upon each update
            this.store.dispatch(new IncomeActions.AddIncome(JSON.parse(value.data)));
          },
          error: (error: any) => {
            console.error(error)
          }
        }
      )
    }
  };
}
