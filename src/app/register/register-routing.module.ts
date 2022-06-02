import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginDetailsComponent } from '../register/login-details/login-details.component';
import { PakistanNationalityDetailsComponent } from '../register/pakistan-nationality-details/pakistan-nationality-details.component';
import { AccountTypeComponent } from './account-type/account-type.component';
import { AdditionalDetailsComponent } from './additional-details/additional-details.component';
import { CrsFatcaDeclarationComponent } from './crs-fatca-declaration/crs-fatca-declaration.component';
import { ForeignInformationComponent } from './foreign-information/foreign-information.component';
import { PassportDetailsComponent } from './passport-details/passport-details.component';
import { SubmitSuccessComponent } from './submit-success/submit-success.component';
import { SupportingDocumentsComponent } from './supporting-documents/supporting-documents.component';
import { TellUsMoreAboutYourself1Component } from './tell-us-more-about-yourself1/tell-us-more-about-yourself1.component';
import { ValidatethedetailsComponent } from './validatethedetails/validatethedetails.component';
import { YourForeignBankDetailsComponent } from './your-foreign-bank-details/your-foreign-bank-details.component';
import { AuthGuardService as AuthGuard } from '../Services/auth-guard.service'

const routes: Routes = [
  {path:'LoginDetails', component:LoginDetailsComponent},
  {path:'PakistanNationalityDetails', component:PakistanNationalityDetailsComponent},
  {path:'Validatethedetails', component:ValidatethedetailsComponent},
  {path:'AccountType', component:AccountTypeComponent, canActivate: [AuthGuard]},
  {path:'PassportDetails', component:PassportDetailsComponent, canActivate: [AuthGuard]},
  {path:'ForeignInformation', component:ForeignInformationComponent, canActivate: [AuthGuard]},
  {path:'TellUsMoreAboutYourself1', component:TellUsMoreAboutYourself1Component, canActivate: [AuthGuard]},
  {path:'YourForeignBankDetails', component:YourForeignBankDetailsComponent, canActivate: [AuthGuard]},
  {path:'SupportingDocuments', component:SupportingDocumentsComponent, canActivate: [AuthGuard]},
  {path:'SubmitSuccess', component:SubmitSuccessComponent, canActivate: [AuthGuard]},
  {path:'AdditionalDetails', component:AdditionalDetailsComponent, canActivate: [AuthGuard]},
  {path:'CrsFatcaDeclaration', component:CrsFatcaDeclarationComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [
            RouterModule.forChild(routes),
          
          ],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
