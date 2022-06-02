import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StarRatingComponent } from 'ng-starrating';
import { CommonService } from '../../Services/common.service'
import { Router } from '@angular/router'
import { ErrorMessageKeyService } from '../../Services/error-message-key.service';
import { KycService } from '../../Services/kyc.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../Services/auth.service";
import { RatingService } from "../../Services/rating.service";

@Component({
  selector: 'app-submit-success',
  templateUrl: './submit-success.component.html',
  styleUrls: ['./submit-success.component.scss']
})
export class SubmitSuccessComponent implements OnInit {

  newform : FormGroup;
  LoginResponse ;
  submitAttempt : boolean = false;
  feedbackcheck : boolean;
  Referencenumber : string;

  @ViewChild("modalOne") modalOne: ElementRef;

  constructor(
    public translate : TranslateService, 
    public renderer: Renderer2,
    public formbuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private _router: Router,
    public errorKey: ErrorMessageKeyService,
    public kyc: KycService,
    public rating : RatingService
    ) { 
    translate.setDefaultLang('en');
    translate.use('en');
  }

  async ngOnInit(): Promise<void> {

    this.newform = this.formbuilder.group({
      Rating : ["", Validators.compose([Validators.required])],
      Comment : [""]
    })

    this.auth.accessToken = await this.auth.Get('token');

    var a = await this.common.Get('User');
    if(a){
      this.LoginResponse = JSON.parse(a);
      this.Referencenumber = this.LoginResponse.userId;
    }

    if(this.LoginResponse.feedbackResponse == true){
      this.feedbackcheck = true;
    }

    this.kyc.count = 0;
    this.common.presentLoading();
    debugger
    var object = JSON.parse(await this.common.Get('User'));
    this.auth.data.onBoardingAccount.productId = object.onBoardingAccount.productId;
    this.kyc.GetKycStatus(this.auth.accessToken, this.auth.data.onBoardingAccount ? this.auth.data.onBoardingAccount.productId : 1).then(async (data: any) => {
      if (data.response) {
        if (data.response.code) {
          if (data.response.code == 1) {
            //  this.country.countries=data.response.content;

            if (this.kyc.totalCount > 0) {
              let nextscreen = this.kyc.getScreen(this.kyc.count);
              debugger;
              if (nextscreen == "SubmitSuccess") {
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
  }

  showPopup() {
    this.renderer.addClass(this.modalOne.nativeElement, "active");
  }

  hidePopup() {
    this.renderer.removeClass(this.modalOne.nativeElement, "active");
  }

  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}) {
    // Old Value:${$event.oldValue},
    // Checked Color: ${$event.starRating.checkedcolor}, 
      // Unchecked Color: ${$event.starRating.uncheckedcolor}
    // alert(`New Value: ${$event.newValue}`);
    this.newform.patchValue({'Rating': $event.newValue})
  }

  formpost(){
    debugger
    if(this.LoginResponse.feedbackResponse == false){
      this.SaveInfo();
      debugger
      this.common.presentLoading();
      debugger
      this.rating.SubmitResponse(this.auth.accessToken, this.rating.object).then((data : any) => {
        if(data?.response?.code == 1){
          this.common.hideLoading();debugger
          this.LoginResponse.feedbackResponse = true;
          this.common.Set('User', JSON.stringify(this.LoginResponse));
          this.renderer.removeClass(this.modalOne.nativeElement, "active");
          this.feedbackcheck = true;
        }
        else{
          this.common.hideLoading();
          this.common.ParseErrorAlert("","",this._router,data);
        }
      })
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
    if (!this.newform.valid) {
      return true;
    } else {
      false;
    }
  }

  SaveInfo(){
    debugger
    var object = this.rating.object;

    var commentvalue = this.newform.get('Comment').value;
    object.Comment = (commentvalue == null)? "" : commentvalue;
    
    object.Rating = this.newform.get('Rating').value;
      
  }
}
