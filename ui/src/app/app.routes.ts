import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { UserLoginComponent } from './auth/user-login/user-login.component';
import { UserRegisterComponent } from './auth/user-register/user-register.component';
import { UserResetPasswordComponent } from './auth/user-reset-password/user-reset-password.component';
import { DonateComponent } from './shared/donate/donate.component';
import { HowToComponent } from './shared/how-to/how-to.component';
import { AppComponent } from './app.component';
import { NewTransactionComponent } from './core/transactions/new-transaction/new-transaction.component';
import { NewBsRecordComponent } from './core/balance-sheet/new-bs-record/new-bs-record.component';
import { SplashComponent } from './shared/splash/splash.component';
import { NewExpenseTransactionComponent } from './core/transactions/new-expense-transaction/new-expense-transaction.component';
import { NewIncomeTransactionComponent } from './core/transactions/new-income-transaction/new-income-transaction.component';

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
    { path: 'home', component: HomeComponent },
    { path: 'splash', component: SplashComponent },
    { path: 'income', component: NewIncomeTransactionComponent },
    { path: 'expense', component: NewExpenseTransactionComponent },
];
