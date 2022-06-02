import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorMessageKeyService } from '../../Services/error-message-key.service';
import { CommonService } from '../../Services/common.service'
import { AdditionalFieldsService } from '../../Services/additional-fields.service'
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../Services/auth.service';
import { KycService } from '../../Services/kyc.service';
import { StorageMap } from '@ngx-pwa/local-storage'

@Component({
  selector: 'app-additional-details',
  templateUrl: './additional-details.component.html',
  styleUrls: ['./additional-details.component.scss']
})
export class AdditionalDetailsComponent implements OnInit {

  counter: string;
  current: string;
  max: string;
  newform: FormGroup;
  submitAttempt: boolean = false;
  Occupationlist = [];
  POAList = [];
  EMCTRList = [];
  SOFList = [];
  token;
  idstring;
  loginresponse;

  constructor(
    public translate: TranslateService,
    private _addfldserv: AdditionalFieldsService,
    public formbuilder: FormBuilder,
    private _router: Router,
    public errorKey: ErrorMessageKeyService,
    public common: CommonService,
    private auth: AuthService,
    private kyc: KycService,
    private storagemap: StorageMap,
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  async ngOnInit(): Promise<void> {

    this.newform = this.formbuilder.group({
      Occupation: ["", Validators.compose([Validators.required])],
      CompanyName: ["", Validators.compose([Validators.required])],
      MonthlyIncome: ["", Validators.compose([Validators.required])],
      PurposeOfAcc: ["", Validators.compose([Validators.required])],
      MonthExpctCrditTrans: ["", Validators.compose([Validators.required])],
      ExpctMonthCrditTrnovr: ["", Validators.compose([Validators.required])],
      // Remittance: ["", Validators.compose([Validators.required])],
    })


    var id = await this.auth.Get('FormId');
    this.idstring = id.toString();
    console.log(this.idstring);

    this.counter = "2";
    this.current = "8";
    this.max = "13";

    this.auth.accessToken = await this.auth.Get('token');

    this.common.presentLoading();
    this.loginresponse = JSON.parse(await this.common.Get('User'));
    this.auth.data.onBoardingAccount.productId = this.loginresponse.onBoardingAccount.productId;
    this.kyc.count = 0;
    this.kyc.GetKycStatus(this.auth.accessToken, this.auth.data.onBoardingAccount ? this.auth.data.onBoardingAccount.productId : 1).then(async (data: any) => {
      if (data.response) {
        if (data.response.code) {
          if (data.response.code == 1) {
            //  this.country.countries=data.response.content;

            if (this.kyc.totalCount > 0) {
              let nextscreen = this.kyc.getScreen(this.kyc.count);
              debugger;
              if (nextscreen == "AdditionalDetails") {
                this.kyc.GetComboValues(this.auth.accessToken).then((data: any) => {
                  if (data?.response?.code == 1) {
                    this.common.hideLoading();
                    this.Occupationlist = data.response.content.list.Occupation;
                    this.POAList = data.response.content.list.POA;
                    this.EMCTRList = data.response.content.list.EMCTR;
                    // this.SOFList = data.response.content.list.sourceofFund;
                    console.log(this.Occupationlist)
                  }
                  else {
                    this.common.hideLoading();
                    this.common.ParseErrorAlert("", "", this._router, data.message);
                    // console.log(data);
                  }
                })
              }
              else {
                this.common.hideLoading();
                this._router.navigateByUrl("/register/" + nextscreen);
              }
            }
            //   this.navCtrl.push(this.kyc.getScreen(this.kyc.count));
            else {
              this.common.ParseErrorAlert('', '', this._router, data);
            }
          }
          else {
            this.common.ParseErrorAlert('', '', this._router, data);
          }
        }
        else {
          this.common.ParseErrorAlert('', '', this._router, data);
        }
      }
      else {
        this.common.ParseErrorAlert('', '', this._router, data);
      }
    })
  }

  getMessage(key, control) {

    let error = "";
    console.log(key + " " + control);
    this.translate.get([key]).subscribe(data => {
      console.log(data);
      error = data[key];
    })
    return error;
  }

  isFormValid() {
    if (!this.newform.valid) {
      return true;
    } else {
      false;
    }
  }

  formpost() {
    this.common.presentLoading();
    this.saveinfo();
    console.log(this._addfldserv.data);
    debugger
    this._addfldserv.SaveAdditionalFields(
      this.token, this._addfldserv.data).then((data: any) => {
        if (data?.response?.code == 1) {
          console.log(data.response.content);
          this.loginresponse.occupation = data.response.content.occupation;
          this.common.Set('User',JSON.stringify(this.loginresponse));
          debugger
          this.kyc.count = 0;
          this.kyc.GetKycStatus(this.auth.accessToken, this.auth.data.onBoardingAccount ? this.auth.data.onBoardingAccount.productId : 1).then(async (data: any) => {
            if (data.response) {
              if (data.response.code) {
                if (data.response.code == 1) {
                  //  this.country.countries=data.response.content;

                  if (this.kyc.totalCount > 0) {
                    let nextscreen = this.kyc.getScreen(this.kyc.count);
                    debugger;
                    await this.common.hideLoading();
                    this._router.navigateByUrl("/register/" + nextscreen);
                  }
                  //   this.navCtrl.push(this.kyc.getScreen(this.kyc.count));
                  else {
                    this.common.ParseErrorAlert('', '', this._router, data);
                  }
                }
                else {
                  this.common.ParseErrorAlert('', '', this._router, data);
                }
              }
              else {
                this.common.ParseErrorAlert('', '', this._router, data);
              }
            }
            else {
              this.common.ParseErrorAlert('', '', this._router, data);
            }
          })
        }
        else {
          this.common.hideLoading();
          this.common.ParseErrorAlert("", "", this._router, data);
        }
      })
  }

  formpostdolater() {
    this.common.showDoLaterAlert(this._router).then((data) => {
      if (data == "Logout") {
        this.saveinfo();
        this.common.presentLoading();
        debugger;
        this._addfldserv.SaveAdditionalFields(
          this.token, this._addfldserv.data).then((data: any) => {
            if (data?.response?.code == 1) {
              this.common.hideLoading();
              this.common.clear();
              this._router.navigateByUrl('/login');
            }
            else {
              this.common.hideLoading();
              this.common.ParseErrorAlert("", "", this._router, data.message);
            }
          });
      }
    });
  }

  saveinfo(): void {
    debugger
    var object = this._addfldserv.data;
    this.token = this.auth.accessToken;
    object.Occupation = this.newform.get('Occupation').value;
    object.CompanyName = this.newform.get('CompanyName').value;
    object.MonthExpctCrditTrans = this.newform.get('MonthExpctCrditTrans').value;
    
    var a = this.newform.get('MonthlyIncome').value;
    var b = a.toString()
    
    object.MonthlyIncome = this.newform.get('MonthlyIncome').value;
    object.ExpctMonthCrditTrnovr = this.newform.get('ExpctMonthCrditTrnovr').value;
    object.PurposeOfAccount = this.newform.get('PurposeOfAcc').value;
    object.Remittance = 'Yes';
    object.formid = this.idstring;
    // object.MotherMaidenName = "";
    // object.FrequencyStatements = "";
    // object.MailingAddressLine1 = "";
    // object.MailingAddressLine2 = "";
    // object.Pep = false;
    // object.PepRelation = false;
    // object.PostCodeOfMailAdd = "";
    // object.ResidenceAddressLine1 = "";
    // object.ResidenceAddressLine2 = "";
    // object.StateOfMailAdd = "";
    // object.StateOfResidence = "";
    // object.
  }
}
