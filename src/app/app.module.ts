import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BaseClassService } from './Interceptors/base-class.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StorageModule } from '@ngx-pwa/local-storage';
import { LoginComponent } from './login/login.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedComponentModule } from './SharedComponents/SharedComponent.module';
import { EmailOtpComponent } from './email-otp/email-otp.component';
import { MobileOtpComponent } from './mobile-otp/mobile-otp.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StarRatingModule } from 'angular-star-rating';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { IonicModule } from '@ionic/angular';
import { RatingModule } from 'ng-starrating';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { Error503Component } from './error503/error503.component';
import { CurrencyExchangeRateComponent } from './currency-exchange-rate/currency-exchange-rate.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};
 
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmailOtpComponent,
    MobileOtpComponent,
    Error503Component,
    CurrencyExchangeRateComponent,
  ],
  imports: [
    IonicModule.forRoot(),
    BrowserModule,
    StarRatingModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,    
    // BackButtonDisableModule.forRoot({
    //   preserveScrollPosition: true
    // }),
    NgxMaskModule.forRoot(),
    StorageModule.forRoot({ IDBNoWrap: true }),
    SharedComponentModule,
    HttpClientModule,
    SelectDropDownModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    RatingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: BaseClassService, multi: true
    },
    { 
      provide: JWT_OPTIONS, useValue: JWT_OPTIONS 
    },
    JwtHelperService
  ],
  bootstrap: [AppComponent],
  schemas:   [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
