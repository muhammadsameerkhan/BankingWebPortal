import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { CommonService } from '../../Services/common.service'
import { Router } from '@angular/router'
import { ErrorMessageKeyService } from '../../Services/error-message-key.service';
import { FatcaCrsService, FatcaInterface } from '../../Services/fatca-crs.service';
import { Guid } from "guid-typescript";
import * as _ from 'lodash';
import { PassportService } from '../../Services/passport.service'
import { KycService } from '../../Services/kyc.service'

@Component({
  selector: 'app-crs-fatca-declaration',
  templateUrl: './crs-fatca-declaration.component.html',
  styleUrls: ['./crs-fatca-declaration.component.scss']
})

export class CrsFatcaDeclarationComponent implements OnInit {

  counter: string;
  current: string;
  max: string;
  submitAttempt: boolean = false;
  imageError: string;
  FormPdfbase64: string;
  image64: string[];
  imagebase64: string;
  PdfSaved: boolean;
  newform: FormGroup;
  Reponse1to7No: boolean = false;
  Reponse1to7YesAny: boolean = false;
  uniqueId: Guid;
  id: string;
  Userobj;
  PassportNation: boolean = false;
  US1: string;
  US2: string;
  US3: string;
  terms: boolean;
  AttachedPDFLink;
  usperson : boolean = false;
  uspersonnot : boolean = false;
  Response1check : boolean;
  Response2check : boolean;
  Response3check : boolean;

  @ViewChild('takeinput', { static: false })
  InputVar: ElementRef;

  @ViewChild("modal") Modal: ElementRef;

  @ViewChild("modal2") Modal2: ElementRef;

  customSelectBox

  constructor(
    public formbuilder: FormBuilder,
    public translate: TranslateService,
    private auth: AuthService,
    private common: CommonService,
    private _router: Router,
    public errorKey: ErrorMessageKeyService,
    public fatcaserv: FatcaCrsService,
    public PassportServ: PassportService,
    private kyc: KycService,
    public renderer: Renderer2,
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  async ngOnInit(): Promise<void> {

    this.uniqueId = Guid.create();
    this.id = this.uniqueId.toString();

    this.newform = this.formbuilder.group({
      CS_Dec_Form: ['', Validators.compose([Validators.required])],
      Res_Add_PO_Box: ['', Validators.compose([Validators.required])],
      Res_Attrny_US: ['', Validators.compose([Validators.required])],
      Res_Recv_Funds: ['', Validators.compose([Validators.required])],
      Res_USBirthPlace: ['', Validators.compose([Validators.required])],
      Res_USResident_Citizen: ['', Validators.compose([Validators.required])],
      Res_US_Res_Add: ['', Validators.compose([Validators.required])],
      Res_US_Tel_Num: ['', Validators.compose([Validators.required])],
      ConfirmTerms: ['', Validators.compose([Validators.required])],
      IsUsPerson: [''],
      W9FORMs: [''],
      W8BENFORMs: [''],
    })

    this.counter = "3";
    this.current = "11";
    this.max = "13";
    debugger
    this.auth.accessToken = await this.auth.Get('token');
    var object = JSON.parse(await this.common.Get('User'));
    this.auth.data.onBoardingAccount.productId = object.onBoardingAccount.productId;
    
    debugger
    this.kyc.count = 0;
    this.common.presentLoading();
    this.kyc.GetKycStatus(this.auth.accessToken, this.auth.data.onBoardingAccount ? this.auth.data.onBoardingAccount.productId : 1).then(async (data: any) => {
      if (data.response) {
        if (data.response.code) {
          if (data.response.code == 1) {
            //  this.country.countries=data.response.content;

            if (this.kyc.totalCount > 0) {
              let nextscreen = this.kyc.getScreen(this.kyc.count);
              debugger;
              if (nextscreen == "CrsFatcaDeclaration") {
                this.common.hideLoading();
                console.log(nextscreen);
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

    this.Userobj = JSON.parse(await this.common.Get('User'));
    console.log(this.Userobj)
    debugger
    if(this.Userobj.coRaddfld== "USA" || this.Userobj.residenceCountry== "USA"){
      this.US1 = "1"
      if(this.US1 == "1"){
        this.newform.patchValue({'Res_USResident_Citizen' : this.US1});
        this.PassportNation = true;
        this.Response1check = true;
        this.Reponse1to7YesAny = true;
      }
      else{
        this.PassportNation = false;
        this.Response1check = false;
        this.Reponse1to7YesAny = false;
        this.newform.patchValue({'IsUsPerson' : ''})
        this.newform.patchValue({'W9FORMs' : ''})
        this.newform.patchValue({'W8BENFORMs' : ''})
        this.usperson = false;
        this.uspersonnot = false;
      }
    }
    if(this.Userobj.passportNationality== "USA"){
      this.US2 = "1";
      if(this.US2 = "1"){
        this.newform.patchValue({'Res_USBirthPlace' : this.US2});
        this.PassportNation = true;
        this.Response2check = true;
        this.Reponse1to7YesAny = true;
      }
      else{
        this.PassportNation = false;
        this.Response2check = false;
        this.Reponse1to7YesAny = false;
        this.newform.patchValue({'IsUsPerson' : ''})
        this.newform.patchValue({'W9FORMs' : ''})
        this.newform.patchValue({'W8BENFORMs' : ''})
        this.usperson = false;
        this.uspersonnot = false;
      }
    }
    if (this.Userobj.isUSMobileNo == true) {
      this.US3 = "1";
      if (this.US3 == '1') {
        this.newform.patchValue({ 'Res_US_Res_Add': this.US3 });
        this.PassportNation = true;
        this.Response3check = true;
        this.Reponse1to7YesAny = true;
      }
      else {
        this.PassportNation = false;
        this.Response3check = false;
        this.Reponse1to7YesAny = false;
        this.newform.patchValue({'IsUsPerson': ''})
        this.newform.patchValue({'W9FORMs' : ''})
        this.newform.patchValue({'W8BENFORMs' : ''})
        this.usperson = false;
        this.uspersonnot = false;
      }
    }

  }

  checkformPermision() {
    debugger
    var Response1 = (this.newform.get('Res_USResident_Citizen').value == 1) ? true : false;
    var Response2 = (this.newform.get('Res_USBirthPlace').value == 1) ? true : false;
    var Response3 = (this.newform.get('Res_US_Res_Add').value == 1) ? true : false;
    var Response4 = (this.newform.get('Res_US_Tel_Num').value == 1) ? true : false;
    var Response5 = (this.newform.get('Res_Recv_Funds').value == 1) ? true : false;
    var Response6 = (this.newform.get('Res_Add_PO_Box').value == 1) ? true : false;
    var Response7 = (this.newform.get('Res_Attrny_US').value == 1) ? true : false;
    
    if (!Response1 && !Response2 && !Response3 && !Response4 && !Response5 && !Response6 && !Response7) {
      this.Reponse1to7No = true;
      this.Reponse1to7YesAny = false;
      this.newform.patchValue({'IsUsPerson' : ''})
      this.newform.patchValue({'W9FORMs' : ''})
      this.newform.patchValue({'W8BENFORMs' : ''})
      this.usperson = false;
      this.uspersonnot = false;
    }
    // else {
    //   this.Reponse1to7No = false;
    // }
    

    if(Response1 || Response2 || Response3 || Response4 || Response5 || Response6 || Response7){
      this.Reponse1to7YesAny = true;
      this.Reponse1to7No = false;
      // if(this.Reponse1to7YesAny){
      //   let con = this.newform.controls['IsUsPerson'];
      //   con.setValidators[(['', Validators.required])]
      // }
    }

    (this.terms) ? this.newform.patchValue({ ConfirmTerms: '1' }) : this.newform.patchValue({ ConfirmTerms: '' });


    if(this.newform.get('IsUsPerson').value == 1){
      this.usperson = true;
      if(this.usperson){
        //this.newform.patchValue({'W9FORMs' : ''});
        this.uspersonnot = false;
        if(!this.uspersonnot){
          this.newform.patchValue({'W8BENFORMs' : ''});
        }
      }
    }else if(this.newform.get('IsUsPerson').value != '' && this.newform.get('IsUsPerson').value == 0){
      this.uspersonnot = true;
      this.usperson = false;
      this.newform.patchValue({'W9FORMs' : ''});
    }
    // this.usperson = (this.newform.get('IsUsPerson').value == 1 && 
    //                   this.newform.get('IsUsPerson').value != '') ? true : false;

    
    // if (!this.Reponse1to3Yes) {
    //   if () {
    //     this.Reponse4to7Yes = true;
    //   }
    //   else {
    //     this.Reponse4to7Yes = false;
    //   }
    // }
  }


  ParentFunction(data) {
    debugger
    // this.AttachedPDFLink = data[0];
    if (data[2] == 'CRSFORM') {
      this.newform.patchValue({ CS_Dec_Form: data[1] })
      console.log(data[2] + data[1])
    } else if (data[2] == 'W9FORM') {
      this.newform.patchValue({ W9FORMs: data[1] })
      console.log(data[2] + data[1])
    } else if (data[2] == 'W8BENFORM') {
      this.newform.patchValue({ W8BENFORMs: data[1] })
      console.log(data[2] + data[1])
    }
  }

  AnotherFunction(data) {
    debugger
    if (data == 'CRSFORM') {
      this.newform.patchValue({ CS_Dec_Form: "" });
    } else if (data == 'W9FORM') {
      this.newform.patchValue({ W9FORMs: "" });
    } else if (data == 'W8BENFORM') {
      this.newform.patchValue({ W8BENFORMs: "" });
    }
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
    if(this.newform.get('IsUsPerson').value == 1){
      this.usperson = true;
    }else if(this.newform.get('IsUsPerson').value == 0){
      this.usperson = false;
    }
    //this.usperson = (this.newform.get('IsUsPerson').value == 1) ? true : ((this.newform.get('IsUsPerson').value == 0) ? false:null);
    if (!this.newform.valid) {
      return true
    }
    else {
      if (this.Reponse1to7No) {
        if (this.newform.get('W9FORMs').value == "" && this.newform.get('W8BENFORMs').value == "") {
          return false
        }
      }
      if(this.Reponse1to7YesAny){
        if (this.newform.get('W9FORMs').value == "" && this.newform.get('W8BENFORMs').value == "") {
          return true;
        }
      }
      if (this.Reponse1to7YesAny && this.usperson) {
        if (this.newform.get('W9FORMs').value != "") {
          return false
        }
      }
      if (this.Reponse1to7YesAny && this.uspersonnot) {
        if (this.newform.get('W8BENFORMs').value != "") {
          return false
        }
      }else{
        return true

      }
      // if (!this.Reponse1to7YesAny && !this.usperson) {
      //   if (this.newform.get('W8BENFORMs').value != "") {
      //     return false
      //   }
      // }
    }
  }

  formpost() {
    this.common.presentLoading();
    debugger
    this.SaveInfo();
    var object = this.fatcaserv.dataobject;
    this.usperson = (this.newform.get('IsUsPerson').value == 1) ? true : false;
    if (this.Reponse1to7No) {
      object.W_9_Form = "";
      object.w_8_BEN_Form = "";
    } else if (this.Reponse1to7YesAny && this.usperson) {
      object.W_9_Form = this.newform.get('W9FORMs').value;
      object.w_8_BEN_Form = "";
    } else if (this.Reponse1to7YesAny && !this.usperson) {
      object.W_9_Form = "";
      object.w_8_BEN_Form = this.newform.get('W8BENFORMs').value;
    } 
    // else {
    //   object.W_9_Form = this.newform.get('W9FORMs').value;
    //   object.w_8_BEN_Form = this.newform.get('W8BENFORMs').value;
    // }
    this.fatcaserv.CreatingFatcaCrsResponse(this.auth.accessToken, object).then((data: any) => {
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
        this.SaveInfo();
        var object = this.fatcaserv.dataobject;
        this.usperson = (this.newform.get('IsUsPerson').value == 1) ? true : false;
        if (this.Reponse1to7No) {
          object.W_9_Form = "";
          object.w_8_BEN_Form = "";
        } else if (this.Reponse1to7YesAny && this.usperson) {
          object.W_9_Form = this.newform.get('W9FORMs').value;
          object.w_8_BEN_Form = "";
        } else if (this.Reponse1to7YesAny && !this.usperson) {
          object.W_9_Form = "";
          object.w_8_BEN_Form = this.newform.get('W8BENFORMs').value;
        }
        // else {
        //   object.W_9_Form = this.newform.get('W9FORMs').value;
        //   object.w_8_BEN_Form = this.newform.get('W8BENFORMs').value;
        // }
        this.common.presentLoading();
        debugger;
        this.fatcaserv.CreatingFatcaCrsResponse(
          this.auth.accessToken, object).then((data: any) => {
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

  SaveInfo() {
    var object = this.fatcaserv.dataobject;
    object.ProductId = this.auth.data.onBoardingAccount.productId;
    object.Res_Add_PO_Box = (this.newform.get('Res_Add_PO_Box').value == 1) ? "Yes" : "No";
    object.Res_Attrny_US = (this.newform.get('Res_Attrny_US').value == 1) ? "Yes" : "No";
    object.Res_Recv_Funds = (this.newform.get('Res_Recv_Funds').value == 1) ? "Yes" : "No";
    object.Res_USBirthPlace = (this.newform.get('Res_USBirthPlace').value == 1) ? "Yes" : "No";
    object.Res_USResident_Citizen = (this.newform.get('Res_USResident_Citizen').value == 1) ? "Yes" : "No";
    object.Res_US_Tel_Num = (this.newform.get('Res_US_Tel_Num').value == 1) ? "Yes" : "No";
    object.Res_US_Res_Add = (this.newform.get('Res_US_Res_Add').value == 1) ? "Yes" : "No";
    object.CS_Dec_Form = this.newform.get('CS_Dec_Form').value;
    object.IsUSPerson = (this.usperson == true) ? "Yes" : "No";
  }

  hidePopup() {
    this.renderer.removeClass(this.Modal.nativeElement, "active");
  }

  showPopup() {
    this.renderer.addClass(this.Modal.nativeElement, "active");
  }

  hidePopup2() {
    this.renderer.removeClass(this.Modal.nativeElement, "active");
  }

  showPopup2() {
    this.renderer.addClass(this.Modal.nativeElement, "active");
  }

  customSelectBoxBtn(num){
    this.customSelectBox = num; 
  }

}
