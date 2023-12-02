import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreApiService } from '../../../shared/api/core-api.service';

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
import { Expense } from '../../../model/models.model';

export interface TranactionCategory {
  category: string
}

export interface TransactionType {
  type: string
}



@Component({
  selector: 'app-new-expense-transaction',
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
  templateUrl: './new-expense-transaction.component.html',
  styleUrl: './new-expense-transaction.component.scss'
})
export class NewExpenseTransactionComponent implements OnInit {
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


  newExpenseForm = this.fb.group({
    date: [ this.today, [Validators.required]],
    amount: [null as unknown as number, [Validators.required, Validators.min(-10000000), Validators.max(10000000)]],
    category: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    vendor: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(75)]],
    note: ['', [Validators.maxLength(100)]]
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
    // if (event.kind === 'category') {
    //   this.newExpenseForm.get('category')?.setValue(event.chip);
    // } else if (event.kind === 'income') {
    //   this.newExpenseForm.get('vendor')?.setValue(event.chip);    
    // }  else if (event.kind === 'vendor') {
    //   this.newExpenseForm.get('vendor')?.setValue(event.chip);    
    // }
    
  }

  // protected handleIncomeExpenseSelectClick(type: 'income' | 'expense'): void {
  //   // todo: clear form only if alternative expense type is clicked
  //   this.clearForm();
  //   if (type === 'income') {
  //     this.newExpenseForm.get('category')?.setValue('income');
  //     this.incomeExpenseChipToggle = 'income';
  //   } else {
  //     this.newExpenseForm.get('category')?.setValue('');
  //     this.incomeExpenseChipToggle = 'expense';
  //   };
  // };

  protected clearForm(): void  {
    this.newExpenseForm.setValue({ 
      date: new Date(this.today),
      amount: null,
      category: '',
      vendor: '',
      note: ''
    });
    this.newExpenseForm.markAsPristine();
  }

  private getAndSetChips(): void {
    // this.chips$.subscribe((chips: Chip[]) => {
    //   const expenseCategoryChips: Chip[] = [];
    //   const expenseCategoryChipStrings: string[] = [];
    //   const incomeChips: Chip[] = [];
    //   const incomeChipStrings: string[] = [];
    //   const expenseChips: Chip[] = [];
    //   const expenseChipStrings: string[] = [];
    //   const expenseVendorChips: Chip[] = [];
    //   const expenseVendorChipStrings: string[] = [];

    //   if (chips) {
    //     chips.forEach((chip: Chip) => {
    //       if (chip.kind === 'category') {
    //         expenseCategoryChips.push(chip);
    //         expenseCategoryChipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
    //       } else if (chip.kind === 'income') {
    //         incomeChips.push(chip);
    //         incomeChipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
    //       } else if (chip.kind === 'expense') {
    //         expenseChips.push(chip);
    //         expenseChipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
    //       } else if (chip.kind === 'vendor') {
    //         expenseVendorChips.push(chip);
    //         expenseVendorChipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
    //       };
    //     });
    //   };
    //   this.expenseCategoryChips = expenseCategoryChips;
    //   this.expenseCategoryChipStrings = expenseCategoryChipStrings;

    //   this.expenseVendorChips = expenseVendorChips;
    //   this.expenseVendorChipStrings = expenseVendorChipStrings;

    //   this.incomeChips = incomeChips;
    //   this.incomeChipStrings = incomeChipStrings;

    //   this.expenseChips = expenseChips;
    //   this.expenseChipStrings = expenseChipStrings;
    // },
    //   (error: any )=> console.log(error)
    // );
  }

  protected onSubmit(): void  {
    const values: any = this.newExpenseForm.value;
    
    if (!values) {
      return;
    }
    else if (values) {
      const expenseBody: Expense = {
        date: new Date(values.date),
        amount: values.amount,
        category: values.category.toLowerCase(),
        vendor: values.vendor.toLowerCase(),
        note: values.note.toLowerCase(),
        status: 'active'
      }
      console.log(expenseBody);
      
      this.coreApi.submitNewExpense(expenseBody).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            console.log(value);
            
            // Updates state with new transaction / no need for full data pull on db upon each update
            this.store.dispatch(new UserActions.AddUserTransaction(JSON.parse(value.data)));
          },
          error: (error: any) => {
            console.error(error)
          }
        }
      )
    }
  }
}
