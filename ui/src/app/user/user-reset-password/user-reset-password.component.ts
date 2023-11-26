import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserApiService } from '../../shared/api/user-api.service';
import { first, take } from 'rxjs';

@Component({
  selector: 'app-user-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './user-reset-password.component.html',
  styleUrl: './user-reset-password.component.scss'
})
export class UserResetPasswordComponent {
  passwordResetForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(75)]],
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(75)]],
  })

  constructor (
    private fb: FormBuilder,
    private userApi: UserApiService
  ) {}

  protected clearForm() {
    this.passwordResetForm.setValue({ email: '', username:'' });
  }

  protected onSubmit() {
    const values: any = this.passwordResetForm.value;
    if (!values) {
      return;
    }
    else if(values.email && values.username && values.password) {
      const registerBody: any = {
        email: values.email,
        username: values.username
      }
      console.log(registerBody);
      this.userApi.registerUser(registerBody).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            console.log(value);
            // todo: success notification, check email?
          },
          error: (error: any) => {
            console.error(error)
            // todo: error notification 
          }
        }
      )
    }
  }

}
