import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { first, take } from 'rxjs';
import { UserApiService } from '../../api-services/user-api.service';
import { UserRegister } from '../../models/user.models';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, ToastModule, DialogModule],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.scss',
  providers: [MessageService]
})
export class UserRegisterComponent {
  protected registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(75)]],
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(75)]],
    password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(75)]]
  });
  protected dialogVisible: boolean = false;

  constructor (
    private fb: FormBuilder,
    private userApi: UserApiService,
    private router: Router,
    private messageService: MessageService
  ) {}

  protected showDialog(): void {
    this.dialogVisible = true;
  };

  protected clearForm() {
    this.registerForm.setValue({ email: '', username:'',  password: '' });
  };

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
      };
      // console.log(registerBody);
      this.userApi.registerUser(registerBody).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            // console.log(value);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Registration successful! Please login'
            })
            setTimeout(() => {
              this.router.navigate(['login']);
            }, 2000)
            
          },
          error: (error: any) => {
            console.error(error)
            // todo: error notification
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Registration error! ${error.error.message}`
            })
          }
        }
      )
    };
  };
}
