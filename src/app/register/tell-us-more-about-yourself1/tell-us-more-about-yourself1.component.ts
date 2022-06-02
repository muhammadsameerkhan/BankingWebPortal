import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorMessageKeyService } from '../../Services/error-message-key.service';
import { CommonService } from '../../Services/common.service'
import { AdditionalFieldsService } from '../../Services/additional-fields.service'
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../Services/auth.service';
import { KycService } from '../../Services/kyc.service'
import { Guid } from "guid-typescript";
import { CountriesModel, StatesModel, CitiesModel, CountriesCitiesModel } from "../../Services/countries.service";
import { computeStackId } from '@ionic/angular/directives/navigation/stack-utils';

@Component({
  selector: 'app-tell-us-more-about-yourself1',
  templateUrl: './tell-us-more-about-yourself1.component.html',
  styleUrls: ['./tell-us-more-about-yourself1.component.scss']
})
export class TellUsMoreAboutYourself1Component implements OnInit {

  counter: string;
  current: string;
  max: string;
  newform: FormGroup;
  submitAttempt: boolean = false;
  public frequencyofstatements: [];
  token;
  FName: string;
  CountryName : string;
  CountryNameAutoFill : string;
  Userobj;
  IsAddressdiffer: boolean = null;
  check: boolean = true;
  countryofbirth: string = null;
  CounORescheck: string = null;
  StateofresCheck: number = null;
  Cityofrescheck: number = null;
  CountryofMailcheck: string = null;
  stateofmailcheck: number = null;
  cityofmailcheck: number = null;
  id: Guid;
  uniqueId: string;
  countrieslistofmail: CountriesModel[];
  citylistofmail: CitiesModel[];
  statelistofmail: StatesModel[];
  countrieslistofres: CountriesModel[];
  citylistofres: CitiesModel[];
  statelistofres: StatesModel[];
  countriescitylist: CountriesCitiesModel[];
  citycountrylist: CitiesModel[];


  constructor(
    public translate: TranslateService,
    private _addfldserv: AdditionalFieldsService,
    public formbuilder: FormBuilder,
    private _router: Router,
    public errorKey: ErrorMessageKeyService,
    public common: CommonService,
    private auth: AuthService,
    private kyc: KycService,
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  async ngOnInit(): Promise<void> {

    this.newform = this.formbuilder.group({
      M_M_Name: ["", Validators.compose([Validators.required])],
      CountryOB: ["", Validators.compose([Validators.required])],
      CityOB: [""],
      Pep: ["", Validators.compose([Validators.required])],
      PepRelative: ["", Validators.compose([Validators.required])],
      Frequency: ["", Validators.compose([Validators.required])],
      ResAddress1: ["", Validators.compose([Validators.required])],
      ResAddress2: ["", Validators.compose([Validators.required])],
      CountryORes: [""],
      StateORes: ["", Validators.compose([Validators.required])],
      CityORes: ["", Validators.compose([Validators.required])],
      PostCodeORes: ["", Validators.compose([Validators.required])],
      Addressdiffer: [""],
      MailAddress1: [""],
      MailAddress2: [""],
      CountryOMail: [""],
      StateOMail: [""],
      CityOMail: [""],
      PostCodeOMail: [""],
    })

    this.counter = "2";
    this.current = "8";
    this.max = "13";
    this.id = Guid.create();
    this.uniqueId = this.id.toString();

    this.auth.accessToken = await this.auth.Get('token');
    this.Userobj = JSON.parse(await this.common.Get('User'));
    this.FName = this.Userobj.fatherName;
    this.CountryName = this.Userobj.residenceCountry;
    console.log(this.CountryName)

   this.newform.patchValue({ 'CountryORes': null });
    this.common.presentLoading();
    
    this.auth.data.onBoardingAccount.productId = this.Userobj.onBoardingAccount.productId;
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
              if (nextscreen == "TellUsMoreAboutYourself1") {
                this.kyc.V1Valueobject.Type = "FOS";
                this.kyc.V1Valueobject.UniqueId = this.uniqueId;
                this.kyc.GetCountryCityValuesV1().then((data: any) => {
                  if (data?.response?.code == 1) {
                    // this.common.hideLoading();
                    this.frequencyofstatements = data.response.content.list.FOS;
                    this.countriescitylist = data.response.content.countriesCitites;
                    // this.common.presentLoading();
                    this.kyc.V1Valueobject.UniqueId = Guid.create().toString();
                    this.kyc.GetComboValuesV2().then(async(data: any) => {
                      this.countrieslistofmail = data.response.content.countries;
                      this.countrieslistofres = data.response.content.countries;
                      
                      for(var i=0;i<this.countrieslistofres.length ; i++){
                        if(this.countrieslistofres[i].isoCode3 == this.CountryName){
                          this.CountryNameAutoFill = this.countrieslistofres[i].countryName;
                          //this.newform.patchValue({ 'CountryORes': this.CountryNameAutoFill })
                        }
                      }
                      await this.common.hideLoading();
                    })
                    console.log(this.frequencyofstatements)
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

  Onchange() {
    this.IsAddressdiffer = (this.newform.get('Addressdiffer').value == 1) ? true : false
    this.newform.patchValue({ 'CountryOMail': null });
  }

  CountryOresselect() {
    this.newform.patchValue({ 'StateORes': null })
    this.CounORescheck = null;
    this.StateofresCheck = null;
    this.Cityofrescheck = null;
    let con = this.newform.controls['StateORes'];
    let con1 = this.newform.controls['CityORes'];
    let con2 = this.newform.controls['PostCodeORes'];
    con.markAsUntouched();
    con1.markAsUntouched();
    con2.markAsUntouched();
    this.CounORescheck = this.newform.get('CountryORes').value;
    for (var i = 0; i < this.countrieslistofres.length; i++) {
      if (this.countrieslistofres[i].isoCode3 == this.CounORescheck) {
        this.statelistofres = this.countrieslistofres[i].states;
      }
    }
    if (this.statelistofres.length < 1) {
      this.CounORescheck = null;
    }
  }

  Countryofbirthselect() {
    //this.newform.patchValue({'CountryORes' : this.CountryNameAutoFill})
    this.newform.patchValue({ 'CityOB': " " })
    this.countryofbirth = null;
    let con = this.newform.controls['CityOB'];
    con.markAsUntouched();
    this.countryofbirth = this.newform.get('CountryOB').value;
    for (var i = 0; i < this.countriescitylist.length; i++) {
      if (this.countriescitylist[i].isoCode3 == this.countryofbirth) {
        this.citycountrylist = this.countriescitylist[i].cities;
      }
    }
    debugger
    if (this.citycountrylist.length < 1) {
      this.countryofbirth = null;
    }
  }

  cityoresselected() {
    this.newform.patchValue({ 'PostCodeORes': null })
    this.Cityofrescheck = null;
    let con = this.newform.controls['PostCodeORes'];
    con.markAsUntouched();
    this.Cityofrescheck = this.newform.get('CityORes').value;
  }

  StateofResCheck() {
    this.newform.patchValue({ 'CityORes': null })
    this.StateofresCheck = null;
    let con = this.newform.controls['CityORes'];
    con.markAsUntouched();
    this.StateofresCheck = this.newform.get('StateORes').value;
    for (var i = 0; i < this.statelistofres.length; i++) {
      if (this.statelistofres[i].stateId == this.StateofresCheck) {
        debugger
        this.citylistofres = this.statelistofres[i].cities;
      }
    }
    if (this.citylistofres.length < 1) {
      this.StateofresCheck = null;
    }
  }

  OnSelect() {
    this.newform.patchValue({ 'PepRelative': null })
    this.check = null;
    let con = this.newform.controls['PepRelative'];
    con.markAsUntouched();
    this.check = (this.newform.get('Pep').value == 1) ? true : false;
    if (this.check) {
      this.newform.patchValue({ 'PepRelative': false });
    }
  }

  peprel() {
    debugger
    if (this.newform.get('PepRelative').value == null) {
      this.newform.patchValue({ 'PepRelative': '0' })
    }
  }

  counofmailselect() {
    this.newform.patchValue({ 'StateOMail': null })
    this.CountryofMailcheck = null;
    this.stateofmailcheck = null;
    this.cityofmailcheck = null;
    let con = this.newform.controls['StateOMail'];
    let con1 = this.newform.controls['CityOMail'];
    let con2 = this.newform.controls['PostCodeOMail'];
    con.markAsUntouched();
    con1.markAsUntouched();
    con2.markAsUntouched();
    this.CountryofMailcheck = this.newform.get('CountryOMail').value;
    for (var i = 0; i < this.countrieslistofmail.length; i++) {
      if (this.countrieslistofmail[i].isoCode3 == this.CountryofMailcheck) {
        this.statelistofmail = this.countrieslistofmail[i].states;
      }
    }
    if (this.statelistofmail.length < 1) {
      this.CountryofMailcheck = null;
    }
  }

  stateofmailselect() {
    this.newform.patchValue({ 'CityOMail': null })
    this.stateofmailcheck = null;
    let con = this.newform.controls['CityOMail'];
    con.markAsUntouched();
    this.stateofmailcheck = this.newform.get('StateOMail').value;
    for (var i = 0; i < this.statelistofmail.length; i++) {
      if (this.statelistofmail[i].stateId == this.stateofmailcheck) {
        this.citylistofmail = this.statelistofmail[i].cities;
      }
    }
    if (this.citylistofmail.length < 1) {
      this.stateofmailcheck = null;
    }
  }

  Cityofmailselect() {
    this.newform.patchValue({ 'PostCodeOMail': '' })
    this.cityofmailcheck = null;
    let con = this.newform.controls['PostCodeOMail'];
    con.markAsUntouched();
    this.cityofmailcheck = this.newform.get('CityOMail').value;
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
    debugger
    if (!this.newform.valid) {
      return true;
    } else {
      if (this.IsAddressdiffer) {
        if (this.newform.get('MailAddress1').value != '' && this.newform.get('MailAddress2').value != '' &&
          this.newform.get('CountryOMail').value != '' && this.newform.get('StateOMail').value != '' &&
          this.newform.get('CityOMail').value != '' && this.newform.get('PostCodeOMail').value != '') {
          return false
        }
        return true
      }
      return false;
    }
  }

  clickfunc(){
    debugger
    this.newform.patchValue({'CountryORes' : this.CountryNameAutoFill})
  }

  addressdifferchange(event){
    this.newform.patchValue({ 'CountryOMail': null });
    debugger
    this.IsAddressdiffer = event.detail.checked;
    if(!this.IsAddressdiffer){

      this.CountryofMailcheck = null;
      this.newform.patchValue({'CountryOMail' : null});
      let con = this.newform.controls['CountryOMail'];
      con.markAsUntouched();
      con.reset();

      this.cityofmailcheck = null;
      this.newform.patchValue({'CityOMail' : null});
      let con1 = this.newform.controls['CityOMail'];
      con.markAsUntouched();
      con.reset();

      this.stateofmailcheck = null;
      this.newform.patchValue({'StateOMail' : null});
      let con2 = this.newform.controls['StateOMail'];
      con.markAsUntouched();
      con.reset();

      let con3 = this.newform.controls['MailAddress1'];
      con3.markAsUntouched();
      con3.reset();

      let con4 = this.newform.controls['MailAddress2'];
      con4.markAsUntouched();
      con4.reset();

      let con5 = this.newform.controls['PostCodeOMail'];
      con5.markAsUntouched();
      con5.reset();
      // this.newform.patchValue({ 'CountryOMail': null });
    }
  }

  formpost() {
    this.common.presentLoading();
    this.saveinfo().then((data: any) => {
      debugger
      this._addfldserv.SaveAdditionalFields(
        this.token, this._addfldserv.data).then((data: any) => {
          if (data?.response?.code == 1) {
            console.log(data.response.content.dbdata.id);
            this.Userobj.coRaddfld = this._addfldserv.data.CountryOfResidence;
            this.common.Set("User",JSON.stringify(this.Userobj));
            this.common.Set('FormId', data.response.content.dbdata.id)
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
            debugger
            this.common.hideLoading();
            this.common.ParseErrorAlert("", "", this._router, data);
          }
        })
    });
  }

  formpostdolater() {
    debugger
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
              this.common.ParseErrorAlert("", "", this._router, data);
            }
          });
       }
       //else{
      //   this.common.hideLoading();
      //         this.common.ParseErrorAlert("", "", this._router, data;
      // }
    });
  }

  async saveinfo(): Promise<void> {
    debugger
    var object = this._addfldserv.data;
    this.token = this.auth.accessToken;
    var countryofresvaluecheck = this.newform.get('CountryORes').value
    
    if(countryofresvaluecheck != null){
      object.CountryOfResidence = this.newform.get('CountryORes').value;
    }
    else{
      object.CountryOfResidence = this.CountryName;
    }

    if (!this.IsAddressdiffer) {
      this.newform.patchValue({ 'MailAddress1': this.newform.get('ResAddress1').value });
      this.newform.patchValue({ 'MailAddress2': this.newform.get('ResAddress2').value });
      this.newform.patchValue({ 'CountryOMail': object.CountryOfResidence });
      this.newform.patchValue({ 'StateOMail': this.newform.get('StateORes').value });
      this.newform.patchValue({ 'CityOMail': this.newform.get('CityORes').value });
      this.newform.patchValue({ 'PostCodeOMail': this.newform.get('PostCodeORes').value });
    }
    else if (this.IsAddressdiffer) {
      this.newform.patchValue({ 'MailAddress1': this.newform.get('MailAddress1').value });
      this.newform.patchValue({ 'MailAddress2': this.newform.get('MailAddress2').value });
      this.newform.patchValue({ 'CountryOMail': this.newform.get('CountryOMail').value });
      this.newform.patchValue({ 'StateOMail': this.newform.get('StateOMail').value });
      this.newform.patchValue({ 'CityOMail': this.newform.get('CityOMail').value });
      this.newform.patchValue({ 'PostCodeOMail': this.newform.get('PostCodeOMail').value });
    }

    // (this.IsAddressSame) ? object.AddressLine2 = "Same as AddressLine1"
    //   : object.AddressLine2 = this.newform.get('CurrentAddress').value;


    object.CityOfBirth = " ";
    object.CityOfResidence = this.newform.get('CityORes').value;
    object.CountryOfBirth = this.newform.get('CountryOB').value;
    object.StateOfResidence = this.newform.get('StateORes').value;
    object.ResidenceAddressLine1 = this.newform.get('ResAddress1').value;
    object.ResidenceAddressLine2 = this.newform.get('ResAddress2').value;

    object.PostCodeResidence = this.newform.get('PostCodeORes').value;
    object.MotherMaidenName = this.newform.get('M_M_Name').value;

    object.PostCodeOfMailAdd = this.newform.get('PostCodeOMail').value;
    object.MailingAddressLine1 = this.newform.get('MailAddress1').value;
    object.MailingAddressLine2 = this.newform.get('MailAddress2').value;
    object.CityOfMailAdd = this.newform.get('CityOMail').value;
    object.StateOfMailAdd = this.newform.get('StateOMail').value;
    object.CountryOfMailAdd = this.newform.get('CountryOMail').value;

    var s = this.newform.get('Pep').value;
    var pepvalue = (s == 1) ? true : false;
    object.Pep = pepvalue

    var w = this.newform.get('PepRelative').value;
    var peprelvalue = (w == 1) ? true : false;
    object.PepRelation = peprelvalue;

    object.FrequencyStatements = this.newform.get('Frequency').value;

    object.Occupation = "";
    object.CompanyName = "";
    object.MonthExpctCrditTrans = "";
    object.MonthlyIncome = "";
    object.PurposeOfAccount = "";
    object.ExpctMonthCrditTrnovr = "";

    object.formid = "";

  }
}
