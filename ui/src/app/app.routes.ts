import { Routes } from '@angular/router';
import { UserRegisterComponent } from './auth/user-register/user-register.component';
import { UserLoginComponent } from './auth/user-login/user-login.component';
import { UserResetPasswordComponent } from './auth/user-reset-password/user-reset-password.component';
import { DonateComponent } from './shared/donate/donate.component';
import { HowToComponent } from './shared/how-to/how-to.component';
import { SplashComponent } from './shared/splash/splash.component'
import { BalanceSheetComponent } from './core/balance-sheet/balance-sheet.component';
import { IncomeComponent } from './core/income/income.component';
import { ExpenseComponent } from './core/expense/expense.component';
import { InvestComponent } from './core/invest/invest.component';
import { HomeComponent } from './home/home.component';


export const routes: Routes = [
    { path: '', component: UserRegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'balance-sheeet', component: BalanceSheetComponent },
    { path: 'income', component: IncomeComponent },
    { path: 'invest', component: InvestComponent },
    { path: 'expense', component: ExpenseComponent },
    { path: 'login', component: UserLoginComponent },
    { path: 'register', component: UserRegisterComponent },
    { path: 'password-reset', component: UserResetPasswordComponent },
    { path: 'donate', component: DonateComponent },
    { path: 'how-to', component: HowToComponent },
    { path: 'splash', component: SplashComponent },
];
