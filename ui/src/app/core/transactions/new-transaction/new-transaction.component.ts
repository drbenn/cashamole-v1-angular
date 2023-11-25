import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreApiService } from '../../../shared/api/core-api.service';
import { TransactionBody } from '../../../model/transaction.model';
import { first, take } from 'rxjs';
import { UserActions } from '../../../store/user/userState.actions';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-new-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-transaction.component.html',
  styleUrl: './new-transaction.component.scss'
})
export class NewTransactionComponent implements OnInit {
  today: Date = new Date();

  newTransactionForm = this.fb.group({
    category: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    date: [ this.today, [Validators.required]],
    payee: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(75)]],
    note: ['', [Validators.maxLength(100)]],
    amount: ['', [Validators.required, Validators.min(-10000000), Validators.max(10000000)]]
  })

  constructor (
    private fb: FormBuilder,
    private coreApi: CoreApiService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.today = new Date();
    // console.log('todays date: ', this.today);
    
    // this.newTransactionForm.get('date')?.setValue(this.today);
  }

  protected clearForm() {
    this.newTransactionForm.setValue({ 
      category:'',
      date: new Date(this.today),
      payee: '',
      note: '',
      amount: ''
    });
  }

  protected onSubmit() {
    const values: any = this.newTransactionForm.value;
    
    if (!values) {
      return;
    }
    else if (values) {
      const transactionBody: TransactionBody = {
        category: values.category,
        date: new Date(values.date),
        payee: values.payee,
        note: values.note,
        amount: values.amount,
        status: 'active'
      }
      this.coreApi.submitNewTransaction(transactionBody).pipe(take(1), first())
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
