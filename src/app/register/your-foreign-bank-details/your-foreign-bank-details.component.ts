import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorMessageKeyService } from '../../Services/error-message-key.service';
import { CommonService } from '../../Services/common.service'
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../Services/auth.service';
import { KycService } from '../../Services/kyc.service';
import { CountriesService } from '../../Services/countries.service';
import { FIDCardService } from '../../Services/fidcard.service'
import { Guid } from "guid-typescript";

@Component({
  selector: 'app-your-foreign-bank-details',
  templateUrl: './your-foreign-bank-details.component.html',
  styleUrls: ['./your-foreign-bank-details.component.scss']
})
export class YourForeignBankDetailsComponent implements OnInit {

  counter: string;
  current: string;
  max: string;
  newform: FormGroup;
  submitAttempt: boolean = false;
  countrieslist: [];
  token;
  uniqueId : Guid;
  id : string ;

  constructor(
    public translate: TranslateService,
    public formbuilder: FormBuilder,
    private _router: Router,
    public errorKey: ErrorMessageKeyService,
    public common: CommonService,
    private auth: AuthService,
    private kyc: KycService,
    private countries: CountriesService,
    private _foreignserv: FIDCardService
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  async ngOnInit(): Promise<void> {

    this.newform = this.formbuilder.group({
      AccountTitleName: ["", Validators.compose([Validators.required])],
      BankName: ["", Validators.compose([Validators.required])],
      Country: ["", Validators.compose([Validators.required])],
      IBAN: ["", Validators.compose([Validators.required])],
    })


    this.uniqueId = Guid.create();
    this.id = this.uniqueId.toString();

    this.counter = "2";
    this.current = "9";
    this.max = "13";

    this.auth.accessToken = await this.auth.Get('token');
    var object = JSON.parse(await this.common.Get('User'));
    this.auth.data.onBoardingAccount.productId = object.onBoardingAccount.productId;
    
    this.common.presentLoading();
    this.kyc.count = 0;
    this.kyc.GetKycStatus(this.auth.accessToken, this.auth.data.onBoardingAccount ? this.auth.data.onBoardingAccount.productId : 1).then(async (data: any) => {
      if (data.response) {
        if (data.response.code) {
          if (data.response.code == 1) {
            //  this.country.countries=data.response.content;

            if (this.kyc.totalCount > 0) {
              let nextscreen = this.kyc.getScreen(this.kyc.count);
              debugger;
              if (nextscreen == "YourForeignBankDetails") {
                this.countries.GetAll(this.id).then((data: any) => {
                  if (data?.response?.code == 1) {
                    this.countrieslist = data.response.content.filter(x => x.isStayAllowed == true);
                    this.common.hideLoading();
                  }
                  else {
                    debugger
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
    console.log(this._foreignserv.foreignobject);
    debugger
    this._foreignserv.PostForeignDetails(
      this.token, this._foreignserv.foreignobject).then((data: any) => {
        if (data?.response?.code == 1) {
          this.kyc.count = 0;
          this.kyc.GetKycStatus(this.auth.accessToken, this.auth.data.onBoardingAccount ? this.auth.data.onBoardingAccount.productId : 1).then(async (data: any) => {
            if (data.response) {
              if (data.response.code) {
                if (data.response.code == 1) {
                  //  this.country.countries=data.response.content;

                  if (this.kyc.totalCount > 0) {
                    let nextscreen = this.kyc.getScreen(this.kyc.count);
                    debugger;
                    // if (nextscreen == "CrsFatcaDeclaration") 
                    // {
                    //   this.common.hideLoading();
                    //   console.log(nextscreen);
                    // } 
                    // else {
                    this.common.hideLoading();
                    this._router.navigateByUrl("/register/" + nextscreen);
                    // }
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
        this._foreignserv.PostForeignDetails(
          this.token, this._foreignserv.foreignobject).then((data: any) => {
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

    var object = this._foreignserv.foreignobject;
    this.token = this.auth.accessToken;
    object.AccountTitleName = this.newform.get('AccountTitleName').value;
    object.BankName = this.newform.get('BankName').value;
    object.Country = this.newform.get('Country').value;
    object.IBAN = this.newform.get('IBAN').value;
  }

}
