import { Routes } from '@angular/router';
import { UserRegisterComponent } from './pages/auth/user-register/user-register.component';
import { UserLoginComponent } from './pages/auth/user-login/user-login.component';
import { UserResetPasswordComponent } from './pages/auth/user-reset-password/user-reset-password.component';
import { DonateComponent } from './pages/donate/donate.component';
import { HowToComponent } from './pages/how-to/how-to.component';
import { SplashComponent } from './pages/splash/splash.component'
import { BalanceSheetComponent } from './pages/balance-sheet/balance-sheet.component';
import { IncomeComponent } from './pages/income/income.component';
import { ExpenseComponent } from './pages/expense/expense.component';
import { InvestComponent } from './pages/invest/invest.component';
import { HomeComponent } from './pages/home/home.component';


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
