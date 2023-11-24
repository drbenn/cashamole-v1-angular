import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreApiService } from '../../../shared/api/core-api.service';
import { TransactionBody } from '../../../shared/models/transaction.model';
import { first, take } from 'rxjs';

@Component({
  selector: 'app-new-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-transaction.component.html',
  styleUrl: './new-transaction.component.scss'
})
export class NewTransactionComponent implements OnInit {
  today: string = '';

  newTransactionForm = this.fb.group({
    category: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    date: [ this.today, [Validators.required]],
    payee: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(75)]],
    note: ['', [Validators.maxLength(100)]],
    amount: ['', [Validators.required, Validators.min(-10000000), Validators.max(10000000)]]
  })

  constructor (
    private fb: FormBuilder,
    private coreApi: CoreApiService
  ) {}

  ngOnInit(): void {
    this.today = new Date().toLocaleDateString();
    console.log(this.today);
    
    this.newTransactionForm.get('date')?.setValue(this.today);
  }

  protected clearForm() {
    this.newTransactionForm.setValue({ 
      category:'',
      date: this.today,
      payee: '',
      note: '',
      amount: ''
    });
  }

  protected onSubmit() {
    const values: any = this.newTransactionForm.value;
    console.log(values);
    
    if (!values) {
      return;
    }
    else if (values) {
      const transactionBody: TransactionBody = {
        category: values.category,
        date: values.date,
        payee: values.payee,
        note: values.note,
        amount: values.amount,
        status: 'active'
      }
      console.log(transactionBody);
      this.coreApi.submitNewTransaction(transactionBody).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            console.log('values');
            console.log(value);
            
            
          },
          error: (error: any) => {
            console.error(error)
            if (error.status === 202) {
              console.log('successful login - need to redirect and set state with username/email');
              console.log(error.error);
            };
            if (error.status === 406) {
              console.log('UNsuccessful login');
              console.log(error.error);
            };
          }
        }
      )
    }
  }

}
