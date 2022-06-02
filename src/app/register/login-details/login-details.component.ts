import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidation } from '../../Validators/PasswordValidators';
import { AuthService } from '../../Services/auth.service';
import { CountriesService, Country } from '../../Services/countries.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../Services/common.service';
import { ErrorMessageKeyService } from '../../Services/error-message-key.service';
import { Guid } from "guid-typescript";

@Component({
  selector: 'app-login-details',
  templateUrl: './login-details.component.html',
  styleUrls: ['./login-details.component.scss']
})
export class LoginDetailsComponent implements OnInit {

  countriesList: Country[] = [];
  counter: string;
  current: string;
  max: string;
  selected = null;
  selectedMobile: Country;
  mobilelist: Country[] = [];
  RegistrationForm: FormGroup;
  _password: string = "";
  _confirmPassword: string = "";
  _number: string = "";
  maxNumber: number = 0;
  selectedIso: string = "";
  mask: string = "";
  terms : boolean;
  numberPlaceHolder: string = "";
  submitAttempt: boolean = false;
  getcountry: Country[] = [];
  newcountry: Country[] = [];
  EmailExist : boolean;
  newarray = ['muhammad','sameer','khan'];
  IsUSMobileNo : boolean;
  uniqueId : Guid;
  id : string ;
  mobilemaxlength : number;
  mobileminlength : number;

  @ViewChild("customDropdownList") customDropdownList: ElementRef;

  checkDropDownStatus:boolean = false;

  selectedDropNumber:string = "";

  selectedIcon:string;

  selectAssignNumber:string;

  constructor(
    public formbuilder: FormBuilder,
    public auth: AuthService,
    public countries: CountriesService,
    private _router: Router,
    public translate: TranslateService,
    public errorKey: ErrorMessageKeyService,
    public common: CommonService,
    public Renderer2: Renderer2,
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  showDropList() {
    if(this.checkDropDownStatus == true) {
      this.Renderer2.removeClass(this.customDropdownList.nativeElement, "active");
      this.checkDropDownStatus = false;
    } else {
      this.Renderer2.addClass(this.customDropdownList.nativeElement, "active");
      this.checkDropDownStatus = true;
    }
  }

  selectDropVal(value){
    console.log(value);
    this.selectedMobile = value;
    this.selectedDropNumber = '+' + value.mobileCode;
    this.selectedIcon = "assets/svg-flags/"+ value.flagClass +".svg";
    this.selectAssignNumber = value.mobileCode;
    this.Renderer2.removeClass(this.customDropdownList.nativeElement, "active");
    this.checkDropDownStatus = false;
    let con = this.RegistrationForm.controls['mobile'];
    con.reset();
    this.ChangeMobile(value);
  }

  closeDropdown() {
    this.Renderer2.removeClass(this.customDropdownList.nativeElement, "active");
    this.checkDropDownStatus = false;
  }

  ngOnInit() {
    
    this.RegistrationForm = this.formbuilder.group({
      country: ["", Validators.required],
      code: [""],
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')])],
      mobile: ["", Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$&+,:;=?@#|\'<>.^*()%!-]).{8,15}$')])],
      confirmPassword: ['', Validators.compose([Validators.required,])],
      termsCondition: ['', Validators.compose([Validators.required])],
    }, { validator: PasswordValidation.MatchPassword })
    
    this.uniqueId = Guid.create();
    this.id = this.uniqueId.toString();

    // this.selectedMobile=this.countries.GetCountryObject();
    this.common.presentLoading();
    this.countries.GetAll(this.id).then((data: any) => {

      if (data?.response?.code == 1) {

        this.countriesList = data.response.content.filter(x => x.isStayAllowed == true);
        this.mobilelist = data.response.content.filter(x => x.isMobile == true);
        this.mobilelist.sort((a, b) => a.mobileCode.localeCompare(b.mobileCode));
        //this.mobileList.sort((1,9)=>a.countryName.localeCompare(b.countryName));
        this.getcountry = data.response.content;
        this.common.hideLoading();
      } 
      else {
        debugger
        this.common.hideLoading();
        this.common.ParseErrorAlert("","",this._router,data);
        // console.log(data);
      }

    })


    //   this.selected=this.auth.selectedCountry;
    //   this.maxNumber=this.selected.mobileLength;

    //   this.mask=this.selected.mask?this.selected.mask:new Array(this.maxNumber+1).join('9');
    //   this.numberPlaceHolder=this.selected.mask?this.selected.mask.replace(/9/g,"X"):new Array(this.maxNumber+1).join('X');
    //  // this.maxNumber=1;
    //   console.log(this.selected);

    this.counter = "1";
    this.current = "1";
    this.max = "13";
  }


  // config = {
  //   displayKey:"countryName", //if objects array passed which key to be displayed defaults to description
  //   search:true, //true/false for the search functionlity defaults to false,
  //   height: '0', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
  //   placeholder:'Select', // text to be displayed when no item is selected defaults to Select,
  //   customComparator: ()=>{} ,// a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
  //   limitTo: 3, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
  //   moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
  //   noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
  //   searchPlaceholder:'Search', // label thats displayed in search input,
  //   searchOnKey: 'countryName', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  //   clearOnSelection: false ,// clears search criteria when an option is selected if set to true, default is false
  //   inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
  // }

  isFormValid() {
    debugger
    if (!this.RegistrationForm.valid) {
      return true;
    } else {
      if(this.EmailExist){
        return true;
      }
      return false;
    }
  }

  // loadFlags() {
  //   debugger;
  //   let that=this;
  //   setTimeout(function(){ 
  //     debugger;
  //     if(that.mobilelist){
  //       debugger;
  //       let radios=document.getElementsByClassName('action-sheet-button');
  //       for (let index = 0; index < radios.length; index++) {
  //         let element = radios[index];
  //         console.log("lag Class="+that.mobilelist[index].flagClass);
  //         element.innerHTML=element.innerHTML.concat('<img class="country-image" style="width: 30px;height:16px;" src="assets/svg-flags/'+ that.mobilelist[index].flagClass +'.svg" />');
  //       }
  //     }
    
  // }, 500);
  // }

  Forward() {
    debugger;
    this.RegistrationForm.patchValue({country : this.selected.isoCode3});
    this.auth.registrationObject.email = this.RegistrationForm.get('email').value;
    this.auth.registrationObject.password = this._password;
    this.auth.registrationObject.confirmPassword = this._confirmPassword;
    this.auth.registrationObject.mobileNumber = this.selectedMobile.mobileCode + this._number.replace(/-/g, "").trim();
    this.auth.registrationObject.residenceCountry = this.RegistrationForm.get('country').value;
    this.auth.registrationObject.nationality = "PAK";
    this.auth.registrationObject.issuer = "PAK";
    this.auth.registrationObject.countryID = "PAK";
    this.auth.registrationObject.IsUSMobileNo = this.IsUSMobileNo;
  }

  checkformPermision(){
    (this.terms) ? this.RegistrationForm.patchValue({termsCondition : '1'}) 
                 : this.RegistrationForm.patchValue({termsCondition : ''});
  }

  checkEmail(){
    this.common.presentLoading();
    debugger
    var email = this.RegistrationForm.get('email').value;
    this.auth.CheckEmail(email, this.auth.accessToken).then((data : any) => {
      debugger
      if(data?.response?.code == 5){
        debugger
        var msg = data.response.content;
        if(msg == "Email exists."){
          this.EmailExist = true;
          this.common.hideLoading();
        }
      }
      else if(data?.response?.code == 1){
        var msg = data.response.content;
        if(msg == "Email doesn't exist."){
          this.common.hideLoading();
          this.EmailExist = false;
        }
      }
      else{
        this.common.hideLoading();
        this.common.ParseErrorAlert("","",this._router,data.message);
      }
    })
  }

  onChange(value) {
    debugger;
   // this.Renderer2.removeClass(this.customDropdownList.nativeElement, "active");
    console.log(value, "select value")
    this.selected = value;
    this.selectedMobile = this.selected;
    this.selectedDropNumber = '+'+this.selectedMobile.mobileCode;
    this.selectedIcon = "assets/svg-flags/"+this.selectedMobile.flagClass+".svg";
    console.log(this.selectedMobile);
    if (this.selectedMobile) {
      console.log("Selected", JSON.stringify(this.newcountry));
      //this.auth.selectedCountry = this.newcountry
      // this.selected = this.auth.selectedCountry;
      this.maxNumber = this.selectedMobile.mobileMaxLength;
      this.mobileminlength = this.selectedMobile.mobileLength;
      if(this.selectedMobile.countryName == "United States"){
        this.IsUSMobileNo = true;
      }
      else{
        this.IsUSMobileNo = false;
      }

      this.mask = this.selectedMobile.mask ? this.selectedMobile.mask : new Array(this.maxNumber + 1).join('9');
      this.numberPlaceHolder = this.selectedMobile.mask ? this.selectedMobile.mask.replace(/9/g, "X") : new Array(this.mobileminlength + 1).join('X');
      this.mobilemaxlength = this.selectedMobile.mobileMaxLength;
      this._number = "";
      let con = this.RegistrationForm.controls['mobile'];
      con.clearValidators();
      con.reset();
      this.selectedMobile = this.selected;
      con.setValidators(Validators.compose([Validators.required,Validators.pattern('[0-9]*')]));
      con.markAsUntouched();
    }

  }

  getMessage(key, control) {
    debugger
    let error = "";
    console.log(key + " " + control);
    this.translate.get([key]).subscribe(data => {
      console.log(data);

      if (control == "mobile") {
        if (key == "MobileMin") {
          //   console.log(this.projectassetsP.UserNameMin.toString());
          error = data[key];
          error = error.replace("{minLength}", this.mobileminlength.toString());
        }
        else if (key == "MobileMax") {
          error = data[key];
          error = error.replace("{maxLength}", this.mobilemaxlength.toString());
        }
        else {
          //  console.log("Return");
          // console.log(data[key]);
          error = data[key];
        }
      }
      else {
        // console.log("Return");
        // console.log(data[key]);
        error = data[key];
      }
    })
    return error;
  }

  ChangeMobile(selectvalue) {
    debugger
    this._number = "";
    console.log("Selected", JSON.stringify(this.newcountry));
    //this.auth.selectedCountry = this.newcountry
    // this.selected = this.auth.selectedCountry;
    this.maxNumber = selectvalue.mobileMaxLength;
    this.mobileminlength = selectvalue.mobileLength;
    if(selectvalue.countryName == "United States"){
      this.IsUSMobileNo = true;
    }
    else{
      this.IsUSMobileNo = false;
    }
    this.mask = selectvalue.mask ? selectvalue.mask : new Array(this.maxNumber + 1).join('9');
    this.numberPlaceHolder = selectvalue.mask ? selectvalue.mask.replace(/9/g, "X") : new Array(this.maxNumber + 1).join('X');
    this._number = "";
    let con = this.RegistrationForm.controls['mobile'];
    con.clearValidators();
    con.reset();
    con.setValidators(Validators.compose([Validators.required,Validators.pattern('[0-9]*')]));
    con.markAsUntouched();
  }

  stopLabel(e) {
    e.preventDefault();
    window.open("../../../assets/RDA-Terms-&-Conditions.pdf", '_blank');
  }
}
