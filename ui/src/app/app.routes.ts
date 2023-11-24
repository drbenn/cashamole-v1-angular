import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { UserResetPasswordComponent } from './user/user-reset-password/user-reset-password.component';
import { DonateComponent } from './donate/donate.component';
import { HowToComponent } from './common/how-to/how-to.component';
import { AppComponent } from './app.component';
import { NewTransactionComponent } from './core/transactions/new-transaction/new-transaction.component';
import { NewBsRecordComponent } from './core/balance-sheet/new-bs-record/new-bs-record.component';

export const routes: Routes = [
    // { path: '', component: HomeComponent },
    { path: '', component: UserRegisterComponent },
    { path: 'login', component: UserLoginComponent },
    { path: 'register', component: UserRegisterComponent },
    { path: 'password-reset', component: UserResetPasswordComponent },
    { path: 'donate', component: DonateComponent },
    { path: 'how-to', component: HowToComponent },
    { path: 'new-transaction', component: NewTransactionComponent },
    { path: 'new-bs-record', component: NewBsRecordComponent },
    
];
