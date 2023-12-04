import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreApiService } from '../../../shared/api/core-api.service';
import { Observable, first, take } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { UserActions } from '../../../store/user/userState.actions';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChipSelectComponent } from '../../../shared/chip-select/chip-select.component';
import { Chip } from '../../../model/chips.model';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BalanceSheetEntry } from '../../../model/models.model';
import { UserState } from '../../../store/user/userState.state';


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
    SelectButtonModule
  ],
  templateUrl: './new-bs-record.component.html',
  styleUrl: './new-bs-record.component.scss'
})
export class NewBsRecordComponent implements OnInit {
  @Select(UserState.assetChips) assetChips$!: Observable<Chip[]>;
  @Select(UserState.liabilityChips) liabilityChips$!: Observable<Chip[]>;
  assetChips: Chip[] = [];
  assetChipStrings: string[] = [];
  liabilityChips: Chip[] = [];
  liabilityChipStrings: string[] = [];
  assetLiabilityToggle: 'asset' | 'liability' = 'asset';
  bsTypes: BalanceSheetType[] = [{ type: 'asset'}, { type: "liability"}];
  selectedBsType: BalanceSheetType = this.bsTypes[0];
  today: Date = new Date();
  
  newRecordForm = this.fb.group({
    type: ['asset', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    date: [this.today, [Validators.required]],
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

  private setBsChips(type: 'asset' | 'liability', chips: Chip[]) {
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
    } else {
      this.assetLiabilityToggle = 'liability';
    };
  };

  protected clearForm(): void {
    this.newRecordForm.setValue({ 
      type: this.selectedBsType.type,
      date: new Date(this.today),
      description: '',
      amount: null
    });
  }

  protected onSubmit(): void {
    const values: any = this.newRecordForm.value;

    if (!values) {
      return;
    }
    else if (values) {
      const balanceSheetEntry: BalanceSheetEntry = {
        type: values.type,
        date: new Date(values.date),
        description: values.description,
        amount: values.amount,
        status: 'active'
      };
      
      this.coreApi.submitNewBsRecord(balanceSheetEntry).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            // Updates state with new transaction / no need for full data pull on db upon each update
            this.store.dispatch(new UserActions.AddUserBalanceRecord(JSON.parse(value.data)));
          },
          error: (error: any) => {
            console.error(error);
          }
        }
      );
    };
  };
}
