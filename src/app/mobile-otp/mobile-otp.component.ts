import { Component, Input, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from './../Services/auth.service';
import { CommonService } from './../Services/common.service';
import { ConfigService } from '../Services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorMessageKeyService } from './../Services/error-message-key.service';
import { KycService } from './../Services/kyc.service';
import { CountriesService, Country } from '../Services/countries.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocationStrategy } from '@angular/common';
import { Guid } from 'guid-typescript';
import { ValidationError } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-mobile-otp',
  templateUrl: './mobile-otp.component.html',
  styleUrls: ['./mobile-otp.component.scss']
})
export class MobileOtpComponent implements OnInit {

  counter: string;
  current: string;
  max: string;
  code: string;
  submitAttempt: boolean = false;
  public verify: string = '';
  backSubscription;
  timerexpire: string;
  timeoutHandle;
  type: string = ""
  mobileSuccess: boolean = false;
  resendOptbtnShow: boolean = false;
  loginResponse;
  maxNumber: number = 0;
  _number: string = "";
  mobilemaxlength : number;
  mobileminlength : number;
  selectedMobile: Country;
  IsUSMobileNo;
  mask;
  numberPlaceHolder : string = '';
  mobilelist;
  uniqueId : Guid;
  id : string ;
  @Input() numbertext: string;
  registerForm: FormGroup;
  SecondForm : FormGroup;
  newmobile;
  mobilelistrender : boolean = false;

  @ViewChild("modal") Modal: ElementRef;
  @ViewChild("customDropdownList") customDropdownList: ElementRef;

  checkDropDownStatus:boolean = false;

  selectedDropNumber:string = "";

  selectedIcon:string;
  selectAssignNumber:string;

  constructor(
    private kyc: KycService,
    private country: CountriesService,
    public errorKey: ErrorMessageKeyService,
    private translate: TranslateService,
    private commonP: CommonService,
    private auth: AuthService,
    private config: ConfigService,
    private route: ActivatedRoute,
    private _router: Router,
    private formBuilder: FormBuilder,
    private location: LocationStrategy,
    public Renderer2:Renderer2,
    public countries: CountriesService,

  ) {
    //this.startTime();
    //forbackbuttondisable
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });
 
    this.registerForm = this.formBuilder.group({
      otp: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    })

    this.SecondForm = this.formBuilder.group({
      newmobile : ['',Validators.compose([Validators.required])],
    })
    
  }
  
  async ngOnInit(): Promise<void> {
    
    this.startTime();
    
    this.counter = "1";
    this.current = "4";
    this.max = "13";

    debugger
    let a = await this.commonP.Get('User');
    if(a){
      this.auth.data = JSON.parse(a)
      this.numbertext = this.auth.data.mobileNumber;
      this.getNumber(this.numbertext);
      //console.log(this.numbertext);
      this.loginResponse = JSON.parse(await this.commonP.Get('User'));
      this.auth.data.onBoardingAccount.productId = this.loginResponse.onBoardingAccount.productId;
    }
    
      
    this.auth.accessToken = await this.auth.Get('token');
    
    debugger
    
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
    else if(this.auth.data.mobileStatus){
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
  
  
  getNumber(numbertext){
    if(this.numbertext != null){
      let a=new Array(numbertext.length-4).join('*')+numbertext.substr(numbertext.length-4);
      return a;
    }
  }

  startTime() {
    debugger
    var str = "0:59";
    //var str = this.config.OtpResendTime;
    var array = str.split(":");
    this.countdown(parseInt(array[0]), parseInt(array[1]));
  }

  isFormValid() {
    if (!this.registerForm.valid) {
      return true;
    } else {
        false;
      }
  }

  isSecondFormValid(){
    var a = this.SecondForm.get('newmobile').value;

    if(!this.SecondForm.valid){
      return true
    }
    else{
      false;
    }

    // if (this.newmobile != '') {
    //   if (a == '') {
    //     if(this._number == ''){
    //       return true;
    //     }
    //     return false
    //   } else {
    //      false;
    //   }
    // }

  }

  clearAll() {
    this.verify = "";
  }

  ChangeMobilePost(){
    this.commonP.presentLoading();

    debugger
    var mobile = this.SecondForm.get('newmobile').value;
    this.auth.ChangeMobileOnboarding(mobile, this.auth.accessToken).then((data : any) => {
      debugger
      if(data?.response?.code == 1){
        this.commonP.hideLoading();        
        this.translate.get(["Success", "Ok", "ChangedMobileOTP"]).subscribe((data) => {
          this.commonP.showSuccessAlert(data["Success"], data["ChangedMobileOTP"], data["Ok"], this._router).then((data : any ) => {
            this.hidePopup();
            debugger
            
            this.auth.data.mobileNumber = mobile;
            this.commonP.Set('User',JSON.stringify(this.auth.data));
            // var a = JSON.parse(JSON.stringify(this.commonP.Get('User')));
            // if(a){
            //   this.auth.data = a;
            // }
            this.numbertext = this.auth.data.mobileNumber;
            console.log(this.numbertext)
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

  closeDropdown() {
    this.Renderer2.removeClass(this.customDropdownList.nativeElement, "active");
    this.checkDropDownStatus = false;
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
    // let con = this.SecondForm.controls['newmobile'];
    // con.reset();
    // con.setValidators(Validators.compose([Validators.required,Validators.pattern('[0-9]*')]));
    // con.markAsUntouched();
    this.ChangeMobile(value);
  }

  ChangeMobile(selectvalue) {
    debugger
    this._number = "";
    this.maxNumber = selectvalue.mobileMaxLength;
    this.mobileminlength = selectvalue.mobileLength;
    if(selectvalue.blinkCode == 56){
      this.mobileminlength = this.mobileminlength - 1;
    }
    if(selectvalue.countryName == "United States"){
      this.IsUSMobileNo = true;
    }
    else{
      this.IsUSMobileNo = false;
    }
    this.mask = selectvalue.mask ? selectvalue.mask : new Array(this.maxNumber + 1).join('9');
    this.numberPlaceHolder = selectvalue.mask ? selectvalue.mask.replace(/9/g, "X") : new Array(this.maxNumber + 1).join('X');
    this._number = "";
    //let con = this.SecondForm.controls['newmobile'];
    // con.clearValidators();
    // con.reset();
    // con.setValidators(Validators.compose([Validators.required,Validators.pattern('[0-9]*')]));
    // con.markAsUntouched();
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

  getMessage(key, control) {

    let error = "";
    console.log(key + " " + control);
    this.translate.get([key]).subscribe(data => {

      console.log(data);
      if (control == "newmobile") {
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

  clear(){
    this.code="";
      this.registerForm.reset();
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


  async Next() {
    await this.commonP.presentLoading();
    if (this.type) {
      this.auth.VerifyOTPByType(this.auth.accessToken, this.type, this.code).then(async (data: any) => {
        if (data?.response?.code == 1) {
          this.mobileSuccess = true;

          this.kyc.GetKycStatus(this.auth.accessToken, this.auth.data.onBoardingAccount ? this.auth.data.onBoardingAccount.productId : 1).then(async (data: any) => {
            if (data.response) {
              if (data.response.code) {
                if (data.response.code == 1) {
                  //  this.country.countries=data.response.content;
                  if (this.kyc.totalCount > 0) {
                    let nextscreen = this.kyc.getScreen(this.kyc.count);
                    debugger;

                    if (nextscreen == "VideoselePage") {
                      // if (this.loading)
                      //   this.loading.dismiss();
                      // this.showProfilePage1()
                    }
                    else {
                      if (nextscreen == "AccountType") {

                        await this.commonP.hideLoading();
                        this._router.navigateByUrl("/register/AccountType");


                      } else {
                        await this.commonP.hideLoading();
                        this._router.navigateByUrl("/register/" + nextscreen);

                      }




                    }
                  }
                  //   this.navCtrl.push(this.kyc.getScreen(this.kyc.count));

                  else {
                    this.commonP.ParseErrorAlert('', '', this._router, data);

                  }

                }
                else {
                  this.commonP.ParseErrorAlert('', '', this._router, data);

                }
              } else {
                this.commonP.ParseErrorAlert('', '', this._router, data);

              }
            } else {
              this.commonP.ParseErrorAlert('', '', this._router, data);

            }





          })


        } else {
          await this.commonP.hideLoading();
          this.commonP.ParseErrorAlert("", "", this._router, data);
          this.clearAll();

        }
      })
    } else {
      this.auth.VerifyMobileOnboarding(this.code, this.auth.accessToken).then(async (data: any) => {
        if (data?.response?.code == 1) {
          this.mobileSuccess = true;
          await this.commonP.hideLoading();
          this._router.navigateByUrl("/register/AccountType");

        } else {
          await this.commonP.hideLoading();
          this.commonP.ParseErrorAlert("", "", this._router, data);
          this.clearAll();

        }
      })
    }

  }


  showPopup() {
    
    this.uniqueId = Guid.create();
    this.id = this.uniqueId.toString();
    this.newmobile = 'something';
    this.Renderer2.addClass(this.Modal.nativeElement, "active");
    
    this.commonP.presentLoading();
    this.countries.GetAll(this.id).then((data: any) => {

      if (data?.response?.code == 1) {
        this.mobilelist = data.response.content.filter(x => x.isMobile == true);
        this.mobilelist.sort((a, b) => a.mobileCode.localeCompare(b.mobileCode));
        this.mobilelistrender = true;
        this.selectedIcon = "assets/svg-flags/"+ this.mobilelist[0].flagClass +".svg";
        this.selectedDropNumber = this.mobilelist[0].mobileCode;
        this.mobileminlength = this.mobilelist[0].mobileLength;
        this.mask = this.mobilelist[0].mask ? this.mobilelist[0].mask : new Array(this.maxNumber + 1).join('9');
        this.numberPlaceHolder = this.mobilelist[0].mask ? this.mobilelist[0].mask.replace(/9/g, "X") : new Array(this.mobileminlength + 1).join('X');
        this.mobilemaxlength = this.mobilelist[0].mobileMaxLength;
        //this.mobileList.sort((1,9)=>a.countryName.localeCompare(b.countryName));
        this.commonP.hideLoading();
      } 
      else {
        debugger
        this.commonP.hideLoading();
        this.commonP.ParseErrorAlert("","",this._router,data);
        // console.log(data);
      }

    })
  }

  hidePopup() {
    this.Renderer2.removeClass(this.Modal.nativeElement, "active");
    this.SecondForm.patchValue({'newmobile' : ''});
    this.mobilelistrender = false;
    
  }

}
