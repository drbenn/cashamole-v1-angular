import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { first, take } from 'rxjs';
import { UserApiService } from '../../shared/api/user-api.service';
import { UserRegister } from '../../model/user.models';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.scss'
})
export class UserRegisterComponent {
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(75)]],
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(75)]],
    password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(75)]]
  })

  constructor (
    private fb: FormBuilder,
    private userApi: UserApiService,
    private router: Router
  ) {}

  protected clearForm() {
    this.registerForm.setValue({ email: '', username:'',  password: '' });
  }

  protected onSubmit() {
    const values: any = this.registerForm.value;
    if (!values) {
      return;
    }
    else if(values.email && values.username && values.password) {
      const registerBody: UserRegister = {
        email: values.email,
        username: values.username,
        password: values.password
      }
      // console.log(registerBody);
      this.userApi.registerUser(registerBody).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            // console.log(value);
            // todo: success notification
            this.router.navigate(['home']);
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
