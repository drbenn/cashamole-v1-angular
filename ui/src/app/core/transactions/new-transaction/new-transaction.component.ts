import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreApiService } from '../../../shared/api/core-api.service';

@Component({
  selector: 'app-new-transaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-transaction.component.html',
  styleUrl: './new-transaction.component.scss'
})
export class NewTransactionComponent {
  newTransactionForm = this.fb.group({
    category: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    date: ['', [Validators.required]],
    vendor: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(75)]],
    note: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(75)]],
    amount: ['', [Validators.required, Validators.min(0), Validators.max(10000000)]]
  })

  constructor (
    private fb: FormBuilder,
    private coreApi: CoreApiService
  ) {}

  protected clearForm() {
    this.newTransactionForm.setValue({ 
      category:'',
      date: '',
      vendor: '',
      note: '',
      amount: ''
    });
  }

  protected onSubmit() {
    const values: any = this.newTransactionForm.value;
    console.log(values);
    
    // if (!values) {
    //   return;
    // }
    // else if(values.username && values.password) {
    //   const loginBody: UserLogin = {
    //     username: values.username,
    //     password: values.password
    //   }
    //   console.log(loginBody);
    //   this.userApi.authenticateUser(loginBody).pipe(take(1), first())
    //   .subscribe(
    //     {
    //       next: (value: any) => {
    //         console.log('values');
    //         console.log(value);
            
            
    //       },
    //       error: (error: any) => {
    //         console.error(error)
    //         if (error.status === 202) {
    //           console.log('successful login - need to redirect and set state with username/email');
    //           console.log(error.error);
    //         };
    //         if (error.status === 406) {
    //           console.log('UNsuccessful login');
    //           console.log(error.error);
    //         };
    //       }
    //     }
    //   )
    // }
  }

}
