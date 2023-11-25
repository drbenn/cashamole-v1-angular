import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreApiService } from '../../../shared/api/core-api.service';
import { BalanceSheetEntryBody } from '../../../model/balanceSheet.model';
import { first, take } from 'rxjs';
import { Store } from '@ngxs/store';
import { UserActions } from '../../../store/user/userState.actions';

@Component({
  selector: 'app-new-bs-record',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-bs-record.component.html',
  styleUrl: './new-bs-record.component.scss'
})
export class NewBsRecordComponent implements OnInit {
  today: Date = new Date();

  newRecordForm = this.fb.group({
    type: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    date: [this.today, [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(75)]],
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
    this.newRecordForm.setValue({ 
      type:'',
      date: new Date(this.today),
      description: '',
      amount: ''
    });
  }

  protected onSubmit() {
    const values: any = this.newRecordForm.value;
    
    if (!values) {
      return;
    }
    else if (values) {
      const balanceSheetEntryBody: BalanceSheetEntryBody = {
        type: values.type,
        date: new Date(values.date),
        description: values.description,
        amount: values.amount,
        status: 'active'
      }
      this.coreApi.submitNewBsRecord(balanceSheetEntryBody).pipe(take(1), first())
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
