import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreApiService } from '../../../api-services/core-api.service';
import { Observable, first, take } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChipSelectComponent } from '../../../shared/chip-select/chip-select.component';
import { Chip } from '../../../models/chips.model';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChipState } from '../../../store/chip/chipState.state';
import { BalanceSheetActions } from '../../../store/balanceSheet/bsState.actions';
import { BalanceSheetEntry } from '../../../models/core.model';
import { CalendarState } from '../../../store/calendar/calendar.state';
import {CardModule} from 'primeng/card';


export interface BalanceSheetType {
  type: string
}

@Component({
  selector: 'app-new-bs-record',
  standalone: true,
  imports: [
    CommonModule,
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
  templateUrl: './new-bs-record.component.html',
  styleUrl: './new-bs-record.component.scss'
})
export class NewBsRecordComponent implements OnInit {
  @Select(CalendarState.activeMonthStartDate) activeMonthStartDate$!: Observable<Date>;
  protected activeMonthStartDate!: Date ;
  @Select(ChipState.assetChips) assetChips$!: Observable<Chip[]>;
  @Select(ChipState.liabilityChips) liabilityChips$!: Observable<Chip[]>;
  protected assetChips: Chip[] = [];
  protected assetChipStrings: string[] = [];
  protected liabilityChips: Chip[] = [];
  protected liabilityChipStrings: string[] = [];
  protected assetLiabilityToggle: 'asset' | 'liability' = 'asset';
  protected bsTypes: BalanceSheetType[] = [{ type: 'asset'}, { type: "liability"}];
  protected selectedBsType: BalanceSheetType = this.bsTypes[0];
  protected subheader: string = '';
  private today: Date = new Date();
  
  newRecordForm = this.fb.group({
    type: ['asset', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(75)]],
    amount: [null as unknown as number, [Validators.required, Validators.min(-10000000), Validators.max(10000000)]]
  })

  constructor (
    private fb: FormBuilder,
    private coreApi: CoreApiService,
    private store: Store
  ) {}


  ngOnInit(): void {
    this.today = new Date();
    this.activeMonthStartDate$.subscribe((startDate: Date) => {      
      this.activeMonthStartDate = startDate;
      const activeMonth: string = startDate.toLocaleString(undefined, { month: 'short' });
      const fullyear: string = startDate.getFullYear().toString();
      this.subheader = `Enter new balance sheet record with balance on ${activeMonth} 1, ${fullyear}`
    })
    this.assetChips$.subscribe((chips: Chip[]) => {
      if (chips) {        
        this.setBsChips('asset', chips);
      };
    });
    this.liabilityChips$.subscribe((chips: Chip[]) => {
      if (chips) {
        this.setBsChips('liability', chips);
      };
    });
  };

  private setBsChips(type: 'asset' | 'liability', chips: Chip[]): void {
    if (type === 'asset') {
      this.assetChips = chips;
      this.assetChipStrings = [];
      chips.forEach((chip: Chip) => {
        this.assetChipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
      });
    };
    if (type === 'liability') {
      this.liabilityChips = chips;
      this.liabilityChipStrings = [];
      chips.forEach((chip: Chip) => {
        this.assetChipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
      });
    };
  };

  protected handleChipSelect(event: any): void {
    if (event.kind === 'asset') {
      this.newRecordForm.get('description')?.setValue(event.chip);
    } else if (event.kind === 'liability') {
      this.newRecordForm.get('description')?.setValue(event.chip);    
    };
  };

  protected handleBsSelectClick(type: 'asset' | 'liability'): void {
    if (type === 'asset') {
      this.assetLiabilityToggle = 'asset';
      this.selectedBsType = this.bsTypes[0];
      this.clearForm();
    } else {
      this.assetLiabilityToggle = 'liability';
      this.selectedBsType = this.bsTypes[1];
      this.clearForm();
    };
  };

  protected clearForm(): void {
    this.newRecordForm.setValue({ 
      type: this.selectedBsType.type,
      description: '',
      amount: null
    });
    this.newRecordForm.markAsPristine();
  }

  protected onSubmit(): void {
    const values: any = this.newRecordForm.value;

    if (!values) {
      return;
    }
    else if (values) {
      const balanceSheetEntry: BalanceSheetEntry = {
        type: values.type,
        date: this.activeMonthStartDate,
        description: values.description && values.description.length ? values.description.toLowerCase() : '',
        amount: values.amount ? values.amount : 0,
        status: 'active'
      };
      
      this.coreApi.submitNewBsRecord(balanceSheetEntry).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            // Updates state with new transaction / no need for full data pull on db upon each update
            this.store.dispatch(new BalanceSheetActions.AddUserBalanceRecord(JSON.parse(value.data)));
            this.clearForm();
          },
          error: (error: any) => {
            console.error(error);
          }
        }
      );
    };
  };
}
