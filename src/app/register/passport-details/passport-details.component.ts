import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService, Country } from '../../Services/countries.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ErrorMessageKeyService } from '../../Services/error-message-key.service';
import * as moment from 'moment';
import { CommonService } from '../../Services/common.service'
import { PassportService } from '../../Services/passport.service'
import { AuthService } from '../../Services/auth.service'
import { KycService } from '../../Services/kyc.service'
import { Guid } from "guid-typescript";

@Component({
  selector: 'app-passport-details',
  templateUrl: './passport-details.component.html',
  styleUrls: ['./passport-details.component.scss']
})
export class PassportDetailsComponent implements OnInit {

  counter: string;
  current: string;
  max: string;
  Passport: string = "Passport";
  passportbase64: string;
  passportform: FormGroup;
  submitAttempt: boolean = false;
  countriesList: Country[] = [];
  doe;
  doesplit;
  doemax;
  doeyears;
  doemin;
  dob: string;
  uniqueId : Guid;
  id : string ;
  doedayslistArray= [];
  DoedaySelect : number = null;
  DoeMonthSelect : number = null;
  DoeYearSelect : number = null;
  DoeIsFebSelect : boolean = false;
  Doeisyearleap : boolean = false;
  DoedefaultSelect : boolean = true;
  DoethirtySelect ;
  othernationality : string = null;
  doestring;
  doeError;
  savedolatervalue;
  continuevalue;

  doemonthlistArray = [{
    value: 1,
    text: "January"
  },
  {
    value: 2,
    text: "February"
  }, {
    value: 3,
    text: "March"
  }, {
    value: 4,
    text: "April"
  }, {
    value: 5,
    text: "May"
  }, {
    value: 6,
    text: "June"
  }, {
    value: 7,
    text: "July"
  }, {
    value: 8,
    text: "August"
  }, {
    value: 9,
    text: "September"
  }, {
    value: 10,
    text: "October"
  }, {
    value: 11,
    text: "November"
  }, {
    value: 12,
    text: "December"
  }];

  @ViewChild("modal") Modal: ElementRef;
  
  constructor(
    public translate: TranslateService,
    public formbuilder: FormBuilder,
    private _router: Router,
    public countries: CountriesService,
    public errorKey: ErrorMessageKeyService,
    public common: CommonService,
    private passportservice: PassportService,
    private auth: AuthService,
    private kyc: KycService,
    public renderer: Renderer2,
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  Passportfunction(data) {
    debugger
    this.passportbase64 = data;
    this.passportform.patchValue({ PassportImage: this.passportbase64 })
  }

  async ngOnInit(): Promise<void> {

    this.passportform = this.formbuilder.group({
      PassportImage: ["", Validators.compose([Validators.required])],
      FirstName: ["", Validators.compose([Validators.required])],
      MiddleName: [""],
      LastName: ["", Validators.compose([Validators.required])],
      PassportNumber: ["", Validators.compose([Validators.required])],
      passportexpiry: ["", Validators.compose([Validators.required])],
      CountryofIssuance: ["", Validators.compose([Validators.required])],
      Nationality: ["", Validators.compose([Validators.required])],
      OtherNationality: [""],
      DoedaySelect: ['', Validators.compose([Validators.required])],
      DoeMonthSelect: ['', Validators.compose([Validators.required])],
      DoeYearSelect: ['', Validators.compose([Validators.required])],
    })
    this.uniqueId = Guid.create();
    this.id = this.uniqueId.toString();

    const DOEYEARS = () => {
      const years = []
      debugger
      const dateStart = moment()
      const dateEnd = moment().add(12, 'y')
      while (dateEnd.diff(dateStart, 'years') >= 0) {
        years.push(dateStart.format('YYYY'))
        dateStart.add(1, 'year')
      }
      return years
    }
    this.doeyears = DOEYEARS();
    this.doeyears.sort((one, two) => (one > two ? -1 : 1));

    for (var i = 1; i <= 31; i++) {
      this.doedayslistArray.push(i);
    }

    this.counter = "2";
    this.current = "6";
    this.max = "13";
    this.doemin = moment().add(1, 'days').format('YYYY-MM-DD');
    this.doemax = moment().add(12, 'years').format('YYYY-MM-DD');

    this.auth.data = JSON.parse(await this.common.Get('User'));
    this.auth.accessToken = await this.auth.Get('token');

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
              if (nextscreen == "PassportDetails") {
                console.log(nextscreen);
                this.countries.GetAll(this.id).then((data: any) => {
                  if (data?.response?.code == 1) {
                    this.countriesList = data.response.content;
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
    if (!this.passportform.valid) {
      return true;
    } else {
      false;
    }
  }

  leapYear(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
  }

  DoeSelectionchange() {
    debugger
    const sb = document.querySelector('#doedayslist') as HTMLSelectElement;

    // if (this.DoedaySelect != null) {
    //   sb.style.color = '#354F52'
    // }

    this.passportform.patchValue({ 'DOE': null })
    debugger
    //days
    if (this.DoeYearSelect != null) {
      var check = this.leapYear(this.DoeYearSelect)
    }

    if (this.DoedaySelect != null && this.DoeMonthSelect != null && this.DoeYearSelect != null) {
      if (this.DoeMonthSelect.toString().length == 1) {
        var monthvalue = "0" + this.DoeMonthSelect
      }
      if (this.DoedaySelect.toString().length == 1) {
        var DoedaySelectvalue = "0" + this.DoedaySelect;
      }
      if (monthvalue != null && DoedaySelectvalue != null) {
        this.doestring = this.DoeYearSelect + "-" + monthvalue + "-" + DoedaySelectvalue;
      } else if (monthvalue != null && DoedaySelectvalue == null) {
        this.doestring = this.DoeYearSelect + "-" + monthvalue + "-" + this.DoedaySelect;
      } else if (monthvalue == null && DoedaySelectvalue != null) {
        this.doestring = this.DoeYearSelect + "-" + this.DoeMonthSelect + "-" + DoedaySelectvalue;
      } else if (monthvalue == null && DoedaySelectvalue == null) {
        this.doestring = this.DoeYearSelect + "-" + this.DoeMonthSelect + "-" + this.DoedaySelect;
      }
      if (this.doestring! < this.doemin) {
        this.doeError = true;
        this.passportform.patchValue({ 'passportexpiry': null });
      } else {
        this.doeError = false;
        this.passportform.patchValue({ 'passportexpiry': this.doestring });
      }
      console.log(this.doestring);
    }

    if (this.DoeMonthSelect == 1 || this.DoeMonthSelect == 3 || this.DoeMonthSelect == 5 || this.DoeMonthSelect == 7 || this.DoeMonthSelect == 8 || this.DoeMonthSelect == 10 || this.DoeMonthSelect == 12) {

      if (!this.doedayslistArray.includes(28)) { this.doedayslistArray.push(28) }
      if (!this.doedayslistArray.includes(29)) { this.doedayslistArray.push(29) }
      if (!this.doedayslistArray.includes(30)) { this.doedayslistArray.push(30) }
      if (!this.doedayslistArray.includes(31)) { this.doedayslistArray.push(31) }

    }

    else if (this.DoeMonthSelect != 2 && this.DoeMonthSelect == 4 || this.DoeMonthSelect == 6 || this.DoeMonthSelect == 9 || this.DoeMonthSelect == 11) {

      if (!this.doedayslistArray.includes(28)) { this.doedayslistArray.push(28) }
      if (!this.doedayslistArray.includes(29)) { this.doedayslistArray.push(29) }
      if (!this.doedayslistArray.includes(30)) { this.doedayslistArray.push(30) }

      var lastindex = this.doedayslistArray.length - 1;
      if (this.doedayslistArray.includes(31)) { this.doedayslistArray.splice(lastindex, 1) }

      // this.dayslistArray.sort((a,b) => (a > b ? 1 : -1));
      if (this.DoedaySelect == 31) {
        this.DoedaySelect = null;
        //sb.style.color = 'red'
      }

    }

    else if (this.DoeMonthSelect == 2) {
      if (this.DoeYearSelect != null) {
        if (check) {

          if (!this.doedayslistArray.includes(28)) { this.doedayslistArray.push(28) }
          if (!this.doedayslistArray.includes(29)) { this.doedayslistArray.push(29) }

          var lastindex = this.doedayslistArray.length - 1;
          if (this.doedayslistArray.includes(31)) { this.doedayslistArray.splice(lastindex, 1) }

          var lastindex = this.doedayslistArray.length - 1;
          if (this.doedayslistArray.includes(30)) { this.doedayslistArray.splice(lastindex, 1) }

          if (this.DoedaySelect == 30 || this.DoedaySelect == 31) {
            this.DoedaySelect = null;
           // sb.style.color = 'red'
          }
        }
        else {
          if (!this.doedayslistArray.includes(28)) { this.doedayslistArray.push(28) }

          var lastindex = this.doedayslistArray.length - 1;
          if (this.doedayslistArray.includes(31)) { this.doedayslistArray.splice(lastindex, 1) }

          var lastindex = this.doedayslistArray.length - 1;
          if (this.doedayslistArray.includes(30)) { this.doedayslistArray.splice(lastindex, 1) }

          var lastindex = this.doedayslistArray.length - 1;
          if (this.doedayslistArray.includes(29)) { this.doedayslistArray.splice(lastindex, 1) }

          if (this.DoedaySelect == 29 || this.DoedaySelect == 30 || this.DoedaySelect == 31) {
            this.DoedaySelect = null;
            //sb.style.color = 'red'
          }
        }
      }
      else {
        if (!this.doedayslistArray.includes(28)) { this.doedayslistArray.push(28) }
        var lastindex = this.doedayslistArray.length - 1;
        if (this.doedayslistArray.includes(31)) { this.doedayslistArray.splice(lastindex, 1) }
        var lastindex = this.doedayslistArray.length - 1;
        if (this.doedayslistArray.includes(30)) { this.doedayslistArray.splice(lastindex, 1) }
        var lastindex = this.doedayslistArray.length - 1;
        if (this.doedayslistArray.includes(29)) { this.doedayslistArray.splice(lastindex, 1) }

        if (this.DoedaySelect == 29 || this.DoedaySelect == 30 || this.DoedaySelect == 31) {
          this.DoedaySelect = null;
          //sb.style.color = 'red'
        }
      }
    }
  }

  RemoveFunction(){
    this.passportform.patchValue({'PassportImage': null});
  }

  SavePassportdetails(): void {

    this.doe = this.passportform.get('passportexpiry').value;
    this.doesplit = this.doe.split('T');

    var object = this.passportservice.passportObject;

    object.DOE = this.doesplit[0];
    object.FrontCardImage = this.passportbase64;
    object.type = "C";
    var firstname = this.passportform.get('FirstName').value.toUpperCase();
    object.FirstName = firstname;
    var middlename = object.MiddleName = this.passportform.get('MiddleName').value.toUpperCase();
    var lastname = object.FamilyName = this.passportform.get('LastName').value.toUpperCase();

    if (this.passportform.get('MiddleName').value == null) {
      object.FullName = firstname + " " + middlename;
    } else {
      object.FullName = firstname + " " + middlename + " " + lastname;
    }

    object.Gender = this.auth.data.gender;
    object.Issuer = this.passportform.get('CountryofIssuance').value;
    object.MrtDraw = "";
    object.CountryId = "PAK";

    var a = this.auth.data.dob.toString();
    var asplit = a.split('T');
    object.DOB = asplit[0];
    object.DeviceID = "";
    object.DocumentCode = "P";
    object.DocumentNumber = this.passportform.get('PassportNumber').value;
    object.Nationality = this.passportform.get('Nationality').value;
    object.OptionalData1 = "";
    object.OptionalData2 = "";
  }

  showPopupsavedolater(){
    this.renderer.addClass(this.Modal.nativeElement, "active");
    this.savedolatervalue = true;
  }

  showPopupcontinue(){
    this.renderer.addClass(this.Modal.nativeElement, "active");
    this.continuevalue = true;
  }

  isanotherformvalid(){
    debugger
    //var a = this.passportform.get('OtherNationality').value;
    if(this.othernationality != null){
      return false;
    }
    else{
      return true;
    }
  }

  NoOthernationality(){
    if(this.savedolatervalue){
      var b = this.passportservice.passportObject;
      b.OtherNationlity = '';
      this.PassportPostdolater();
    }
    else if(this.continuevalue){
      var b = this.passportservice.passportObject;
      b.OtherNationlity = '';
      this.PassportPost();
    }
  }

  ContinueOtherNationality(){
    if(this.savedolatervalue){
      var b = this.passportservice.passportObject;
      if(this.othernationality != null){
        b.OtherNationlity = this.othernationality;
      }
      this.PassportPostdolater();
    }
    else if(this.continuevalue){
      var b = this.passportservice.passportObject;
      if(this.othernationality != null){
        b.OtherNationlity = this.othernationality;
      }
      this.PassportPost();
    }
  }

  hidePopup(){
    this.renderer.removeClass(this.Modal.nativeElement, "active");
    this.continuevalue = false;
    this.savedolatervalue = false;
    this.othernationality = null;
  }

  PassportPost() {

    this.SavePassportdetails();
    debugger
    console.log(this.passportservice.passportObject);
    this.common.presentLoading();
    debugger;
    this.passportservice.Set(this.auth.accessToken).then((data: any) => {
      debugger;
      if (data?.response?.code == 1) {
        this.auth.data.PassportNationality = this.passportform.get('Nationality').value;
        this.common.Set('User', JSON.stringify(this.auth.data));
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
    });
  }

  PassportPostdolater() {
    this.common.showDoLaterAlert(this._router).then((data) => {
      if (data == "Logout") {
        this.SavePassportdetails();
        this.common.presentLoading();
        debugger;
        this.passportservice.Set(this.auth.accessToken).then((data: any) => {
          if (data?.response?.code == 1) {
            this.common.hideLoading();
            this.common.clear();
            this.passportservice.Clear();
            this._router.navigateByUrl('/login');
          }
          else {
            this.common.hideLoading();
            this.common.ParseErrorAlert("", "", this._router, data);
          }
        });
      }
    });
  }
}
