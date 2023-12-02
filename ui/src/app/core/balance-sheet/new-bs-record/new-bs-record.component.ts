import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreApiService } from '../../../shared/api/core-api.service';
import { Observable, first, take } from 'rxjs';
import { Store } from '@ngxs/store';
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
  bsTypes: BalanceSheetType[] = [{ type: 'asset'}, { type: "liability"}];
  selectedBsType: BalanceSheetType = this.bsTypes[0];
  
  today: Date = new Date();

  chips$: Observable<any> = this.store.select((state) => state.user.chips);
  assetChips: Chip[] = [];
  assetChipStrings: string[] = [];
  liabilityChips: Chip[] = [];
  liabilityChipStrings: string[] = [];
  assetLiabilityToggle: 'asset' | 'liability' = 'asset';

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
    this.getAndSetChips();
  }

  private getAndSetChips(): void {
    this.chips$.subscribe((chips: Chip[]) => {
      const assetChips: Chip[] = [];
      const assetChipStrings: string[] = [];
      const liabilityChips: Chip[] = [];
      const liabilityChipStrings: string[] = [];

      if (chips) {
        chips.forEach((chip: Chip) => {
          // console.log(chips);
          
          if (chip.kind === 'asset') {
            assetChips.push(chip);
            assetChipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
          } else if (chip.kind === 'liability') {
            liabilityChips.push(chip);
            liabilityChipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
          };
        });
      }
      this.assetChips = assetChips;
      this.liabilityChips = liabilityChips;
      this.assetChipStrings = assetChipStrings;
      this.liabilityChipStrings = liabilityChipStrings;
    },
      (error: any )=> console.log(error)
    );
  }

  protected handleChipSelect(event: any) {
    console.log('handleChipSelect: ', event);
    if (event.kind === 'asset') {
      this.newRecordForm.get('description')?.setValue(event.chip);
    } else if (event.kind === 'liability') {
      this.newRecordForm.get('description')?.setValue(event.chip);    
    }
    
  }

  protected handleBsSelectClick(type: 'asset' | 'liability'): void {
    console.log(type);
    
    if (type === 'asset') {
      this.assetLiabilityToggle = 'asset';
    } else {
      this.assetLiabilityToggle = 'liability';
    };
  };

  protected clearForm() {
    this.newRecordForm.setValue({ 
      type: this.selectedBsType.type,
      date: new Date(this.today),
      description: '',
      amount: null
    });
  }

  protected onSubmit() {
    console.log("SHITBAG");
    
    const values: any = this.newRecordForm.value;

    if (!values) {
      return;
    }
    else if (values) {
      console.log(values);
      
      const balanceSheetEntry: BalanceSheetEntry = {
        type: values.type,
        date: new Date(values.date),
        description: values.description,
        amount: values.amount,
        status: 'active'
      }
      console.log(balanceSheetEntry);
      
      this.coreApi.submitNewBsRecord(balanceSheetEntry).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            // Updates state with new transaction / no need for full data pull on db upon each update
            this.store.dispatch(new UserActions.AddUserBalanceRecord(JSON.parse(value.data)));
          },
          error: (error: any) => {
            console.error(error)
          }
        }
      )
    }
  }
}
