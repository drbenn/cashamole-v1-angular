import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { UserResetPasswordComponent } from './user/user-reset-password/user-reset-password.component';
import { DonateComponent } from './donate/donate.component';
import { HowToComponent } from './common/how-to/how-to.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    // { path: '', component: HomeComponent },
    { path: '', component: UserRegisterComponent },
    { path: 'login', component: UserLoginComponent },
    { path: 'register', component: UserRegisterComponent },
    { path: 'password-reset', component: UserResetPasswordComponent },
    { path: 'donate', component: DonateComponent },
    { path: 'how-to', component: HowToComponent },
    
];
