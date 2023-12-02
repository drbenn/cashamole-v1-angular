import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreApiService } from '../../../shared/api/core-api.service';
import { TransactionBody } from '../../../model/transaction.model';
import { Observable, first, take } from 'rxjs';
import { UserActions } from '../../../store/user/userState.actions';
import { Store } from '@ngxs/store';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChipSelectComponent } from '../../../shared/chip-select/chip-select.component';
import { Chip } from '../../../model/chips.model';
import { SelectButtonModule } from 'primeng/selectbutton';

export interface TranactionCategory {
  category: string
}

export interface TransactionType {
  type: string
}

@Component({
  selector: 'app-new-transaction',
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
  templateUrl: './new-transaction.component.html',
  styleUrl: './new-transaction.component.scss'
})
export class NewTransactionComponent implements OnInit {
  protected transactionTypes: TransactionType[] = [{ type: 'expense'}, { type: "income"}];
  protected selectedTransactionType: TransactionType = this.transactionTypes[0];

  protected transactionCategories: TranactionCategory[] = [{ category: 'discretionary'}, { category: "recurring"}];
  protected selectedTransactionCategory: TranactionCategory = this.transactionCategories[0];

  protected today: Date = new Date();

  chips$: Observable<any> = this.store.select((state) => state.user.chips);
  expenseCategoryChips: Chip[] = [];
  expenseCategoryChipStrings: string[] = [];
  expenseVendorChips: Chip[] = [];
  expenseVendorChipStrings: string[] = [];
  // vendorChips: Chip[] = [];
  // vendorChipStrings: string[] = [];
  incomeChips: Chip[] = [];
  incomeChipStrings: string[] = [];
  expenseChips: Chip[] = [];
  expenseChipStrings: string[] = [];
  incomeExpenseChipToggle: 'income' | 'expense' = 'expense';


  newTransactionForm = this.fb.group({
    type: [this.selectedTransactionType.type, [Validators.required]],
    category: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    date: [ this.today, [Validators.required]],
    vendor: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(75)]],
    note: ['', [Validators.maxLength(100)]],
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

  protected handleChipSelect(event: any): void  {
    console.log('handleChipSelect: ', event);
    if (event.kind === 'category') {
      this.newTransactionForm.get('category')?.setValue(event.chip);
    } else if (event.kind === 'income') {
      this.newTransactionForm.get('vendor')?.setValue(event.chip);    
    }  else if (event.kind === 'vendor') {
      this.newTransactionForm.get('vendor')?.setValue(event.chip);    
    }
    
  }

  protected handleIncomeExpenseSelectClick(type: 'income' | 'expense'): void {
    // todo: clear form only if alternative expense type is clicked
    this.clearForm();
    if (type === 'income') {
      this.newTransactionForm.get('category')?.setValue('income');
      this.incomeExpenseChipToggle = 'income';
    } else {
      this.newTransactionForm.get('category')?.setValue('');
      this.incomeExpenseChipToggle = 'expense';
    };
  };

  protected clearForm(): void  {
    this.newTransactionForm.setValue({ 
      type: this.transactionTypes[0].type,
      category:'',
      date: new Date(this.today),
      vendor: '',
      note: '',
      amount: null
    });
    this.newTransactionForm.markAsPristine();
  }

  private getAndSetChips(): void {
    this.chips$.subscribe((chips: Chip[]) => {
      const expenseCategoryChips: Chip[] = [];
      const expenseCategoryChipStrings: string[] = [];
      const incomeChips: Chip[] = [];
      const incomeChipStrings: string[] = [];
      const expenseChips: Chip[] = [];
      const expenseChipStrings: string[] = [];
      const expenseVendorChips: Chip[] = [];
      const expenseVendorChipStrings: string[] = [];

      if (chips) {
        chips.forEach((chip: Chip) => {
          if (chip.kind === 'category') {
            expenseCategoryChips.push(chip);
            expenseCategoryChipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
          } else if (chip.kind === 'income') {
            incomeChips.push(chip);
            incomeChipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
          } else if (chip.kind === 'expense') {
            expenseChips.push(chip);
            expenseChipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
          } else if (chip.kind === 'vendor') {
            expenseVendorChips.push(chip);
            expenseVendorChipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
          };
        });
      };
      this.expenseCategoryChips = expenseCategoryChips;
      this.expenseCategoryChipStrings = expenseCategoryChipStrings;

      this.expenseVendorChips = expenseVendorChips;
      this.expenseVendorChipStrings = expenseVendorChipStrings;

      this.incomeChips = incomeChips;
      this.incomeChipStrings = incomeChipStrings;

      this.expenseChips = expenseChips;
      this.expenseChipStrings = expenseChipStrings;
    },
      (error: any )=> console.log(error)
    );
  }

  protected onSubmit(): void  {
    const values: any = this.newTransactionForm.value;
    
    if (!values) {
      return;
    }
    else if (values) {
      const transactionBody: TransactionBody = {
        type: values.type.toLowerCase(),
        category: values.type === 'income' ? 'income' : values.category.toLowerCase(),
        date: new Date(values.date),
        vendor: values.vendor.toLowerCase(),
        note: values.note.toLowerCase(),
        amount: values.amount,
        status: 'active'
      }
      console.log(transactionBody);
      
      // this.coreApi.submitNewTransaction(transactionBody).pipe(take(1), first())
      // .subscribe(
      //   {
      //     next: (value: any) => {
      //       console.log(value);
            
      //       // Updates state with new transaction / no need for full data pull on db upon each update
      //       this.store.dispatch(new UserActions.AddUserTransaction(JSON.parse(value.data)));
      //     },
      //     error: (error: any) => {
      //       console.error(error)
      //     }
      //   }
      // )
    }
  }
}
