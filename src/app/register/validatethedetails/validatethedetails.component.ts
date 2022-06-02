import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorMessageKeyService } from '../../Services/error-message-key.service';
import { CommonService } from '../../Services/common.service'
import { KycService } from '../../Services/kyc.service';
import { AuthService } from '../../Services/auth.service'
import { Guid } from 'guid-typescript';
import { CountriesService, CityListModel, BranchModel } from '../../Services/countries.service'

@Component({
  selector: 'app-validatethedetails',
  templateUrl: './validatethedetails.component.html',
  styleUrls: ['./validatethedetails.component.scss']
})
export class ValidatethedetailsComponent implements OnInit {
  @ViewChild("modal") Modal: ElementRef;
  counter: string;
  current: string;
  max: string;
  id : Guid;
  uniqueId : string ;
  newform : FormGroup;
  Type = "State";
  DaysCheck : boolean;
  terms : boolean;
  CityList : CityListModel[];
  BranchList : BranchModel[];
  cityselected : number = null;
  submitAttempt : boolean = false;

  constructor(
    public translate: TranslateService,
    public formbuilder: FormBuilder,
    private _router: Router,
    public errorKey: ErrorMessageKeyService,
    public common : CommonService,
    private KycServ : KycService,
    public auth : AuthService,
    private countries : CountriesService,
    public renderer: Renderer2,
    ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
    debugger
    this.id = Guid.create();
    this.uniqueId = this.id.toString();
    
    if(this.auth.registrationObject.frontCardImage == ""){  
      this._router.navigateByUrl("/register/LoginDetails");
    }

    this.newform = this.formbuilder.group({
      FName: ["", Validators.compose([Validators.required])],
      City: ["", Validators.compose([Validators.required])],
      Branch : ["", Validators.compose([Validators.required])],
      IsSpentDays: ["", Validators.compose([Validators.required])],
      ConfirmTerms: ["", Validators.compose([Validators.required])],
    })

    this.counter = "1";
    this.current = "4";
    this.max = "13";

    this.common.presentLoading();
    debugger
    var object = this.KycServ.V1Valueobject;
    object.Type = this.Type;
    object.UniqueId = this.uniqueId;
    this.countries.GetBranches(this.uniqueId).then((data : any) => {
      if(data?.response?.code == 1){
        this.CityList = data.response.content;
        this.common.hideLoading();
      }
      else {
        this.common.hideLoading();
        this.common.ParseErrorAlert("","",this._router,data.message);
        // console.log(data);
      }
    })
  }

  hidePopup() {
    this.renderer.removeClass(this.Modal.nativeElement, "active");
  }

  showPopup() {
    this.renderer.addClass(this.Modal.nativeElement, "active");
  }

  stopLabel(e) {
    e.preventDefault();
    // window.open("../assets/sbp.pdf", '_blank');
    this.showPopup();
  }

  CitySelectChangeMethod() {
    this.newform.patchValue({'Branch' : null});
    let con = this.newform.controls['Branch'];
    con.markAsUntouched;
    con.reset();
    this.cityselected = this.newform.get('City').value;
    console.log(this.cityselected);
    debugger
    for (var i = 0; i < this.CityList.length; i++) {
      if (this.CityList[i].cityId == this.cityselected) {
        this.BranchList = this.CityList[i].branches;
        break;
      }
    }

    if(this.BranchList.length < 1){
      this.cityselected = null;
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
    if (!this.newform.valid) {
      return true;
    } else {
      if(!this.DaysCheck){
        return true;
      }
      return false;
    }
  }

  OnTermsCheck(){
    (this.terms) ? this.newform.patchValue({ConfirmTerms : '1'}) : this.newform.patchValue({ConfirmTerms : ''});
  }

  SpentDaysCheck(){
    debugger
    this.DaysCheck = (this.newform.get('IsSpentDays').value == 1) ? true : false;
    if(!this.DaysCheck){
      this.translate.get(["UnabletoProceed","183days","Back"]).subscribe(async data => {
        this.common.showErrorAlert(
          data["UnabletoProceed"],
          data["183days"],
          data["Back"],
          this._router)
      })
    }
  }

  SaveInfo(){
    var object = this.auth.registrationObject;

    this.id = Guid.create();
    this.uniqueId = this.id.toString();
    
    object.FatherName = this.newform.get('FName').value;
    object.CityId = this.newform.get('City').value;
    object.BranchId = this.newform.get('Branch').value;
    object.UniqueId = this.uniqueId;
    object.IsSpent = (this.newform.get('IsSpentDays').value == 1) ? true : false;
  }

  formpost(){

    this.SaveInfo();

    this.common.presentLoading();
    debugger;
    this.auth.Register().then((data : any) =>{
      debugger;
      if (data?.response?.code == 1) {
        this.common.hideLoading();
        this.common.Set('User', JSON.stringify(data.response.content));
        this.common.Set('token', data.response.token);
        this._router.navigateByUrl('/emailOTP');
      }
      else{
        this.common.hideLoading();
        this.common.ParseErrorAlert("","",this._router,data);
      }
    });
  }

  formpostdolater(){
    this.common.showDoLaterAlert(this._router).then((data) => {
      if(data == "Logout"){
        this.SaveInfo();
        this.common.presentLoading();
        debugger;
        this.auth.Register().then((data : any) =>{
          if (data?.response?.code == 1) {
            this.common.hideLoading();
            this.common.clear();
            this._router.navigateByUrl('/login');
          }
          else{
            this.common.hideLoading();
            this.common.ParseErrorAlert("","",this._router,data.message);
          }
        });
      }
    });
  }
}
