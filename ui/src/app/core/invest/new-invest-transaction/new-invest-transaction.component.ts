import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreApiService } from '../../../shared/api/core-api.service';
import { Observable, first, take } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { Chip } from '../../../model/chips.model';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChipState } from '../../../store/chip/chipState.state';
import { ChipSelectComponent } from '../../../shared/chip-select/chip-select.component';
import { InvestActions } from '../../../store/invest/invest.actions';
import { Invest } from '../../../model/core.model';

@Component({
  selector: 'app-new-invest-transaction',
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
    SelectButtonModule
  ],
  templateUrl: './new-invest-transaction.component.html',
  styleUrl: './new-invest-transaction.component.scss'
})
export class NewInvestTransactionComponent implements OnInit {
  @Select(ChipState.investChips) investChips$!: Observable<Chip[]>;
  protected investChips: Chip[] = [];
  protected investChipStrings: string[] = [];
  protected today: Date = new Date();

  protected newInvestForm = this.fb.group({
    date: [ this.today, [Validators.required]],
    amount: [null as unknown as number, [Validators.required, Validators.min(-10000000), Validators.max(10000000)]],
    institution: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(75)]],
    note: ['', [Validators.maxLength(100)]]
  });

  constructor (
    private fb: FormBuilder,
    private coreApi: CoreApiService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.today = new Date();
    this.investChips$.subscribe((chips: Chip[]) => {
      if (chips) {
        this.setInvestChips(chips);
      };
    });
  };

  private setInvestChips(chips: Chip[]): void {
    this.investChips = chips;
    this.investChipStrings = [];
    chips.forEach((chip: Chip) => {
      this.investChipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
    });
  };

  protected handleInvestChipSelect(event: any): void  {
    this.newInvestForm.get('institution')?.setValue(event.chip);
  };

  protected clearForm(): void  {
    this.newInvestForm.setValue({ 
      date: new Date(this.today),
      amount: null,
      institution: '',
      note: ''
    });
    this.newInvestForm.markAsPristine();
  };

  protected onSubmit(): void  {
    const values: any = this.newInvestForm.value;
    
    if (!values) {
      return;
    }
    else if (values) {
      const investBody: Invest = {
        date: new Date(values.date),
        amount: values.amount,
        institution: values.institution.toLowerCase(),
        note: values.note.toLowerCase(),
        status: 'active'
      }
      
      this.coreApi.submitNewInvestRecord(investBody).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            // Updates state with new transaction / no need for full data pull on db upon each update
            this.store.dispatch(new InvestActions.AddInvest(JSON.parse(value.data)));
          },
          error: (error: any) => {
            console.error(error)
          }
        }
      )
    }
  };
}
