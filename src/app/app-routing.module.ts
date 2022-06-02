import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailOtpComponent } from './email-otp/email-otp.component';
import { LoginComponent } from './login/login.component';
import { MobileOtpComponent } from './mobile-otp/mobile-otp.component';
import { AccountTypeComponent } from './register/account-type/account-type.component';
import { PassportDetailsComponent } from './register/passport-details/passport-details.component';
import { AuthGuardService as AuthGuard } from './Services/auth-guard.service';

import { Error503Component } from './error503/error503.component';

import { CurrencyExchangeRateComponent } from './currency-exchange-rate/currency-exchange-rate.component';

// const routes: Routes = [
//   { path: '', redirectTo: '/login', pathMatch: 'full' },
  
//   {path:'login', component:LoginComponent},
// ];

const routes: Routes = [
  { 
    path: '', redirectTo: '/login', pathMatch: 'full'
  },
  {
    path:'login', component:LoginComponent
  },
  {
    path:'emailOTP', component:EmailOtpComponent, canActivate: [AuthGuard]
  },
  {
    path:'mobileOTP', component:MobileOtpComponent, canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: ()=>import('./register/register.module').then(mod => mod.RegisterModule)
  },
  {
    path:'error503', component:Error503Component, canActivate: [AuthGuard]
  },
  {
    path:'CurrencyExchangeRate', component:CurrencyExchangeRateComponent, canActivate: [AuthGuard]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'}
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
