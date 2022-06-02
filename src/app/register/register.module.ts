import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginDetailsComponent } from './login-details/login-details.component';
import { PakistanNationalityDetailsComponent } from './pakistan-nationality-details/pakistan-nationality-details.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RegisterRoutingModule } from './register-routing.module';
import { SharedComponentModule } from '../SharedComponents/SharedComponent.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AccountTypeComponent } from './account-type/account-type.component';
import { PassportDetailsComponent } from './passport-details/passport-details.component';
import { ForeignInformationComponent } from './foreign-information/foreign-information.component';
import { TellUsMoreAboutYourself1Component } from './tell-us-more-about-yourself1/tell-us-more-about-yourself1.component';
import { YourForeignBankDetailsComponent } from './your-foreign-bank-details/your-foreign-bank-details.component';
import { SupportingDocumentsComponent } from './supporting-documents/supporting-documents.component';
import { SubmitSuccessComponent } from './submit-success/submit-success.component';
import { AdditionalDetailsComponent } from './additional-details/additional-details.component';
import { CrsFatcaDeclarationComponent } from './crs-fatca-declaration/crs-fatca-declaration.component';
import { IonicModule } from '@ionic/angular';
import { RatingModule } from 'ng-starrating';
import { ValidatethedetailsComponent } from './validatethedetails/validatethedetails.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './../../assets/i18n/', '.json');
};
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
@NgModule({
  declarations: [
    LoginDetailsComponent, 
    PakistanNationalityDetailsComponent, 
    AccountTypeComponent, 
    PassportDetailsComponent, 
    ForeignInformationComponent, 
    TellUsMoreAboutYourself1Component, 
    YourForeignBankDetailsComponent, 
    SupportingDocumentsComponent,
    SubmitSuccessComponent, AdditionalDetailsComponent, CrsFatcaDeclarationComponent, ValidatethedetailsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RegisterRoutingModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule,
    NgxMaskModule.forRoot(),
    NgxMaskModule.forChild(),
    IonicModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }}),
      RatingModule
  ],
  schemas:      [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class RegisterModule { }
