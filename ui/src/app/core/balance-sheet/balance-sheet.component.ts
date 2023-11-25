import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreApiService } from '../../shared/api/core-api.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-balance-sheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance-sheet.component.html',
  styleUrl: './balance-sheet.component.scss'
})
export class BalanceSheetComponent {

  // bsTypes: { type: string }[] | undefined = [{ type: 'Asset'}, { type: "Liability"}];

  // selectedBsType: { type: string } | undefined = { type: 'Asset'};


  // newRecordForm = this.fb.group({
  //   type: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
  //   date: ['', [Validators.required]],
  //   description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(75)]],
  //   amount: ['', [Validators.required, Validators.min(0), Validators.max(10000000)]]
  // })

  // constructor (
  //   private fb: FormBuilder,
  //   private coreApi: CoreApiService
  // ) {}

  // protected clearForm() {
  //   this.newRecordForm.setValue({ type: '',  date: '', description: '', amount: '' });
  // }

  // protected onSubmit() {
  //   const values: any = this.newRecordForm.value;
  //   // if (!values) {
  //   //   return;
  //   // }
  //   // else if(values.username && values.password) {
  //   //   const loginBody: UserLogin = {
  //   //     username: values.username,
  //   //     password: values.password
  //   //   }
  //   //   console.log(loginBody);
  //   //   this.userApi.authenticateUser(loginBody).pipe(take(1), first())
  //   //   .subscribe(
  //   //     {
  //   //       next: (value: any) => {
  //   //         console.log('values');
  //   //         console.log(value);
            
            
  //   //       },
  //   //       error: (error: any) => {
  //   //         console.error(error)
  //   //         if (error.status === 202) {
  //   //           console.log('successful login - need to redirect and set state with username/email');
  //   //           console.log(error.error);
  //   //         };
  //   //         if (error.status === 406) {
  //   //           console.log('UNsuccessful login');
  //   //           console.log(error.error);
  //   //         };
  //   //       }
  //   //     }
  //   //   )
  //   // }
  // }

}
