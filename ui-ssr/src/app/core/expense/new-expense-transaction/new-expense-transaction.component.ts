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
import { ChipSelectComponent } from '../../../shared/chip-select/chip-select.component';
import { Chip } from '../../../model/chips.model';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChipState } from '../../../store/chip/chipState.state';
import { ExpenseActions } from '../../../store/expense/expense.actions';
import { Expense } from '../../../model/core.model';



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
  @Select(ChipState.expenseVendorChips) expenseVendorChips$!: Observable<Chip[]>;
  @Select(ChipState.expenseCategoryChips) expenseCategoryChips$!: Observable<Chip[]>;
  protected expenseVendorChips: Chip[] = [];
  protected expenseVendorChipStrings: string[] = [];
  protected expenseCategoryChips: Chip[] = [];
  protected expenseCategoryChipStrings: string[] = [];
  protected today: Date = new Date();

  protected newExpenseForm = this.fb.group({
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
    this.expenseVendorChips$.subscribe((chips: Chip[]) => {
      if (chips) {
        this.setExpenseChips('vendor', chips);
      };
    });
    this.expenseCategoryChips$.subscribe((chips: Chip[]) => {
      if (chips) {
        this.setExpenseChips('category', chips);
      };
    });
  };

  private setExpenseChips(type: 'vendor' | 'category', chips: Chip[]): void {
    if (type === 'vendor') {
      this.expenseVendorChips = chips;
      this.expenseVendorChipStrings = [];
      chips.forEach((chip: Chip) => {
        this.expenseVendorChipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
      });
    };
    if (type === 'category') {
      this.expenseCategoryChips = chips;
      this.expenseCategoryChipStrings = [];
      
      chips.forEach((chip: Chip) => {
        this.expenseCategoryChipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
      });
    };    
  };

  protected handleChipSelect(event: any): void  {
    if (event.kind === 'category') {
      this.newExpenseForm.get('category')?.setValue(event.chip);
    } else if (event.kind === 'vendor') {
      this.newExpenseForm.get('vendor')?.setValue(event.chip);    
    };
  };

  protected clearForm(): void  {
    this.newExpenseForm.setValue({ 
      date: new Date(this.today),
      amount: null,
      category: '',
      vendor: '',
      note: ''
    });
    this.newExpenseForm.markAsPristine();
  };


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
      };
      
      this.coreApi.submitNewExpenseRecord(expenseBody).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            // Updates state with new transaction / no need for full data pull on db upon each update
            this.store.dispatch(new ExpenseActions.AddExpense(JSON.parse(value.data)));
          },
          error: (error: any) => {
            console.error(error)
          }
        }
      )
    }
  };
}
