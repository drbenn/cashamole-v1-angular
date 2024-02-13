import { Routes } from '@angular/router';
import { BalanceSheetComponent } from './pages/balance-sheet/balance-sheet.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DonateComponent } from './pages/donate/donate.component';
import { ExpenseComponent } from './pages/expense/expense.component';
import { HowToComponent } from './pages/how-to/how-to.component';
import { IncomeComponent } from './pages/income/income.component';
import { InvestComponent } from './pages/invest/invest.component';
import { UserLoginComponent } from './pages/user-login/user-login.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';
import { UserResetPasswordComponent } from './pages/user-reset-password/user-reset-password.component';
import { LandingComponent } from './pages/landing/landing.component';


export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'balance-sheeet', loadComponent: () => import('./pages/balance-sheet/balance-sheet.component').then(m => m.BalanceSheetComponent) },
    { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
    { path: 'donate', loadComponent: () => import('./pages/donate/donate.component').then(m => m.DonateComponent) },
    { path: 'expense', loadComponent: () => import('./pages/expense/expense.component').then(m => m.ExpenseComponent) },
    { path: 'how-to', loadComponent: () => import('./pages/how-to/how-to.component').then(m => m.HowToComponent) },
    { path: 'income', loadComponent: () => import('./pages/income/income.component').then(m => m.IncomeComponent) },
    { path: 'invest', loadComponent: () => import('./pages/invest/invest.component').then(m => m.InvestComponent) },
    { path: 'landing', loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent) },
    { path: 'login', loadComponent: () => import('./pages/user-login/user-login.component').then(m => m.UserLoginComponent) },
    { path: 'register', loadComponent: () => import('./pages/user-register/user-register.component').then(m => m.UserRegisterComponent) },
    { path: 'password-reset', loadComponent: () => import('./pages/user-reset-password/user-reset-password.component').then(m => m.UserResetPasswordComponent) },
    { path: '**', loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent) }
];
