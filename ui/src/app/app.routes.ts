import { Routes } from '@angular/router';
import { UserRegisterComponent } from './auth/user-register/user-register.component';
import { UserLoginComponent } from './auth/user-login/user-login.component';
import { UserResetPasswordComponent } from './auth/user-reset-password/user-reset-password.component';
import { DonateComponent } from './shared/donate/donate.component';
import { HowToComponent } from './shared/how-to/how-to.component';
import { NewTransactionComponent } from './core/transactions/new-transaction/new-transaction.component';
import { NewBsRecordComponent } from './core/balance-sheet/new-bs-record/new-bs-record.component';
import { HomeComponent } from './core/home/home.component';
import { SplashComponent } from './shared/splash/splash.component';
import { NewIncomeTransactionComponent } from './core/income/new-income-transaction/new-income-transaction.component';
import { NewExpenseTransactionComponent } from './core/expense/new-expense-transaction/new-expense-transaction.component';
import { BalanceSheetComponent } from './core/balance-sheet/balance-sheet.component';
import { IncomeComponent } from './core/income/income.component';
import { ExpenseComponent } from './core/expense/expense.component';


export const routes: Routes = [
    // { path: '', component: HomeComponent },
    { path: '', component: UserRegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'balance-sheeet', component: BalanceSheetComponent },
    { path: 'new-transaction', component: NewTransactionComponent },
    { path: 'income', component: IncomeComponent },
    { path: 'expense', component: ExpenseComponent },
    { path: 'login', component: UserLoginComponent },
    { path: 'register', component: UserRegisterComponent },
    { path: 'password-reset', component: UserResetPasswordComponent },
    { path: 'donate', component: DonateComponent },
    { path: 'how-to', component: HowToComponent },
    { path: 'splash', component: SplashComponent },
];
