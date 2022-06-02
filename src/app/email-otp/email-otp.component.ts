import { Component, Input, OnInit, ElementRef, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonService } from './../Services/common.service';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../Services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './../Services/auth.service';
import { Router } from '@angular/router';
import { KycService } from './../Services/kyc.service';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { ErrorMessageKeyService } from './../Services/error-message-key.service';
import { LocationStrategy } from '@angular/common';
import { clearTimeout } from 'timers';

@Component({
  selector: 'app-email-otp',
  templateUrl: './email-otp.component.html',
  styleUrls: ['./email-otp.component.scss']
})
export class EmailOtpComponent implements OnInit {

  @ViewChild("modal") Modal: ElementRef;

  inputmaask : string = "9999";
  public verify: string = '';
  type: string = ""
  platform : string = "W";
  counter: string;
  current: string;
  max: string;
  timerexpire: string;
  @Input() emailtext: string ;
  resendOptbtnShow: boolean = false;
  registerForm:FormGroup;
  changeEmailForm :  FormGroup;
  emailSuccess:boolean=false;
  submitAttempt: boolean = false;
  EmailExist : boolean;
  code:string="";
  timeoutHandle;
  backSubscription;
  emailvalidate  : string = '';

  constructor(
    private commonP : CommonService,
    private route:ActivatedRoute,
    private config: ConfigService,
    public translate: TranslateService,
    private auth: AuthService,
    private _router: Router,
    private kyc:KycService,
    private formBuilder:FormBuilder,
    public errorKey: ErrorMessageKeyService,
    private location: LocationStrategy,
    public Renderer2:Renderer2,
    private cd : ChangeDetectorRef,
    ) 
    {
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });

      this.registerForm=this.formBuilder.group({
        otp: ['', Validators.compose([Validators.required,Validators.minLength(6)])],
        //  email: ['', Validators.compose([Validators.required, Validators.pattern('/^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$/')])],
      })
      this.changeEmailForm=this.formBuilder.group({
        email: ['', Validators.compose([Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')])],
      })

     }

  async ngOnInit(): Promise<void> {
    
    this.counter = "1";
    this.current = "3";
    this.max = "13";

   // window.onpopstate = function (e) { window.history.forward(); }
    
    this.startTime();
    this.auth.data = JSON.parse(await this.commonP.Get('User'))
    this.emailtext = this.auth.data.emailId;
    this.auth.accessToken = await this.commonP.Get('token');
    
    if (this.auth.data.emailStatus && this.auth.data.mobileStatus) {
      this.kyc.count = 0;
      this.kyc.GetKycStatus(this.auth.accessToken, this.auth.data.onBoardingAccount ? this.auth.data.onBoardingAccount.productId : 1).then(async (data: any) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              //  this.country.countries=data.response.content;

              if (this.kyc.totalCount > 0) {
                let nextscreen = this.kyc.getScreen(this.kyc.count);
                debugger;
                // if (nextscreen == "AdditionalDetails") {

                // }
                // else {
                this.commonP.hideLoading();
                this._router.navigateByUrl("/register/" + nextscreen);
                // }
              }
              //   this.navCtrl.push(this.kyc.getScreen(this.kyc.count));
              else {
                this.commonP.ParseErrorAlert('', '', this._router, data);
              }
            }
            else {
              this.commonP.ParseErrorAlert('', '', this._router, data);
            }
          }
          else {
            this.commonP.ParseErrorAlert('', '', this._router, data);
          }
        }
        else {
          this.commonP.ParseErrorAlert('', '', this._router, data);
        }
      })
    }
    else if(this.auth.data.emailStatus){
      this.kyc.count = 0;
      this.kyc.GetKycStatus(this.auth.accessToken, this.auth.data.onBoardingAccount ? this.auth.data.onBoardingAccount.productId : 1).then(async (data: any) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              //  this.country.countries=data.response.content;

              if (this.kyc.totalCount > 0) {
                let nextscreen = this.kyc.getScreen(this.kyc.count);
                debugger;
                // if (nextscreen == "AdditionalDetails") {

                // }
                // else {
                this.commonP.hideLoading();
                this._router.navigateByUrl("/register/" + nextscreen);
                // }
              }
              //   this.navCtrl.push(this.kyc.getScreen(this.kyc.count));
              else {
                this.commonP.ParseErrorAlert('', '', this._router, data);
              }
            }
            else {
              this.commonP.ParseErrorAlert('', '', this._router, data);
            }
          }
          else {
            this.commonP.ParseErrorAlert('', '', this._router, data);
          }
        }
        else {
          this.commonP.ParseErrorAlert('', '', this._router, data);
        }
      }) 
    }
  }

  clear(){
    this.code="";
      this.registerForm.reset();
  }

  isFormValid(){
    if(!this.registerForm.valid){
      return true;
    }else{
        false;
      }
  }

  

  ChangeEmailPost(){
    this.commonP.presentLoading();

    debugger
    var email = this.changeEmailForm.get('email').value;
    this.auth.ChangeEmailOnboarding(email, this.auth.accessToken).then((data : any) => {
      debugger
      if(data?.response?.code == 1){
        this.commonP.hideLoading();        
        this.translate.get(["Success", "Ok", "ChangedEmailOTP"]).subscribe((data) => {
          this.commonP.showSuccessAlert(data["Success"], data["ChangedEmailOTP"], data["Ok"], this._router).then((data : any ) => {
            this.hidePopup();
            debugger
            
            this.auth.data.emailId = email;
            this.commonP.Set('User',JSON.stringify(this.auth.data));
            // var a = JSON.parse(JSON.stringify(this.commonP.Get('User')));
            // if(a){
            //   this.auth.data = a;
            // }
            this.emailtext = this.auth.data.emailId;
            console.log(this.emailtext)
            clearInterval(this.timeoutHandle);
            this.startTime();
            this.resendOptbtnShow = false;
            this.clear();
          });
        })
      }
      else {
        this.commonP.hideLoading();
        this.commonP.ParseErrorAlert("", "", this._router, data);
      }
    })
  }

  checkEmail(){
    this.commonP.presentLoading();
    debugger
    var email = this.changeEmailForm.get('email').value;
    this.auth.CheckEmail(email, this.auth.accessToken).then((data : any) => {
      debugger
      if(data?.response?.code == 5){
        debugger
        var msg = data.response.content;
        if(msg == "Email exists."){
          this.EmailExist = true;
          this.commonP.hideLoading();
        }
      }
      else if(data?.response?.code == 1){
        var msg = data.response.content;
        if(msg == "Email doesn't exist."){
          this.commonP.hideLoading();
          this.EmailExist = false;
        }
      }
      else{
        this.commonP.hideLoading();
        this.commonP.ParseErrorAlert("","",this._router,data.message);
      }
    })
  }

  isSecondFormValid(){
    var a = this.changeEmailForm.get('email').value;

    if (!this.changeEmailForm.valid) {
      return true
    }
    else {
      if (this.emailvalidate != '') {
        if (a == '') {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  
  async SendMobileOTP(){
    this.auth.SendOnboardingMobileOTP(this.auth.accessToken).then(async (data:any)=>{
      if(data?.response?.code ==1){
        await this.commonP.hideLoading();
        this._router.navigateByUrl("/mobileOTP");
      }
      else{
        this.clear();
        this.commonP.ParseErrorAlert("","",this._router,data);
      }
    })
  }

  async SendAgain() {
    await this.commonP.presentLoading();
    debugger;
    this.auth.ResendOTP(this.auth.accessToken).then((data: any) => {
      if (data?.response?.code == 1) {

        this.translate.get(["Success", "Ok", "ResendSuccess"]).subscribe((data) => {
          this.commonP.showSuccessAlert(data["Success"], data["ResendSuccess"], data["Ok"], this._router);
          this.startTime();
          this.resendOptbtnShow = false;
          this.clear();
        
        })
      } else {
        this.commonP.ParseErrorAlert("", "", this._router, data);

      }
    })
  }

  startTime() {
    var str = "0:59";
    //var str = this.config.OtpResendTime;
    var array = str.split(":");
    this.countdown(parseInt(array[0]), parseInt(array[1]));
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

  countdown(minutes, seconds) {
    this.timeoutHandle;
    var that = this;
    function tick() {
      //   var counter = document.getElementById("timer");
      // counter.innerHTML =
      //   minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);

      that.timerexpire = minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
      seconds--;
      if (seconds >= 0) {
        that.timeoutHandle = setTimeout(tick, 1000);
      } else {
        if (minutes >= 1) {
          // countdown(mins-1);   never reach “00″ issue solved:Contributed by Victor Streithorst
          setTimeout(function () {
            that.countdown(minutes - 1, 59);
          }, 1000);
        }
      }

      if (that.timerexpire == "0:00") {
        //that.commonP.presentToast("OTP has been expired!")
        that.resendOptbtnShow = true;
      }
    }
    tick();
  }

  clearAll() {
    this.verify = "";
  }

  async Next() {
    await this.commonP.presentLoading();
    if (!this.emailSuccess) {
        this.auth.VerifyEmailOnboarding(this.code, this.auth.accessToken).then((data: any) => {
        if (data?.response?.code == 1) {
          this.emailSuccess = true;
          this.SendMobileOTP();
          this._router.navigateByUrl('/mobileOTP');
          // this.nav.navigateRoot("mobile-otp");
        } else {
          this.clear();
          this.commonP.ParseErrorAlert("", "", this._router, data);
        }
      })
    } 
    else {
      await this.commonP.presentLoading();
      this.SendMobileOTP();
    }
  }

  showPopup() {
    this.Renderer2.addClass(this.Modal.nativeElement, "active");
    this.emailvalidate = 'something';
  }
  hidePopup() {
    this.Renderer2.removeClass(this.Modal.nativeElement, "active");
    this.registerForm.patchValue({'email': ''});
    this.emailvalidate = '';
    let con = this.changeEmailForm.controls['email'];
    con.reset();
  }

}