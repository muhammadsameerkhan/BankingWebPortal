import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from './../Services/common.service';
import { PasswordValidation } from './../Validators/PasswordValidators';
import { ErrorMessageKeyService } from './../Services/error-message-key.service';
import { AuthService } from './../Services/auth.service';
import { ConfigService } from '../Services/config.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { KycService } from './../Services/kyc.service';
import { Country, CountriesService } from './../Services/countries.service';
import { Guid } from "guid-typescript";

import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  submitAttempt: boolean = false;
  registerForm: FormGroup;
  _email: string;
  _password: string;
  passwordType: string = "password";
  id: Guid;
  uniqueId: string;
  deviceInfo = null;

  @ViewChild("eyeIcon") eyeIcon: ElementRef;

  @ViewChild("modal") Modal: ElementRef;

  @ViewChild("modal2") Modal2: ElementRef;

  constructor(
    public translate: TranslateService,
    private kyc: KycService,
    private commonP: CommonService,
    public errorKey: ErrorMessageKeyService,
    public formBuilder: FormBuilder,
    public countries: CountriesService,
    private auth: AuthService,
    private config: ConfigService,
    private _router: Router,
    
    public Renderer2: Renderer2,
    private deviceService: DeviceDetectorService
  ) {

    this.registerForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')])],
      //email: ['', Validators.compose([Validators.required, Validators.pattern('/^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$/')])],
      password: ['', Validators.compose([Validators.required])],
    })

    this.epicFunction();
  }

  showPassword() {
    if (this.passwordType == "text") {
      this.passwordType = "password";
      this.Renderer2.removeClass(this.eyeIcon.nativeElement, "active");
    } else {
      this.passwordType = "text";
      this.Renderer2.addClass(this.eyeIcon.nativeElement, "active");
    }
  }

  epicFunction() {
    //console.log('hello `Home` component');
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    // console.log(this.deviceInfo);
    // console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    // console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    // console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
  }

  ngOnInit(): void {

    this.id = Guid.create();
    this.uniqueId = this.id.toString();

    const userAgent = window.navigator
    // console.log(userAgent);


    this.auth.SaveCounterobject.Browser = this.deviceInfo.browser;
    this.auth.SaveCounterobject.DeviceType = this.deviceInfo.deviceType;
    this.commonP.GetIpAddress().subscribe((res: any) => {
      console.log(res);
      this.auth.SaveCounterobject.IpAddress = res.ip;

      this.auth.SaveCounterobject.PageName = 'LoginPage'
      this.auth.SaveCounterobject.UniqueId = this.uniqueId;
      this.commonP.presentLoading();
      debugger
      this.auth.SavePageCounter(this.auth.SaveCounterobject).then((data: any) => {
        if (data?.response?.code == 1) {
          console.log(data);
          this.commonP.hideLoading();
        }
        else {
          this.commonP.hideLoading();
          this.commonP.ParseErrorAlert('', '', this._router, data);
        }
      })
    });
  }

  // Enter(event){
  //   if (event.keyCode == 13) {
  //     var textboxes = $("input.formtext");
  //     var currentBoxNumber = textboxes.index(event.target);
  //     //var ok = textboxes.value;
  //     //console.log(ok);
  //     if (textboxes[currentBoxNumber + 1] != null) {
  //         var nextBox = textboxes[currentBoxNumber + 1];
  //         nextBox.focus();
  //         //nextBox.;
  //         event.preventDefault();
  //         return false;
  //     }
  // }
  // }

  getMessage(key, control) {

    let error = "";
   // console.log(key + " " + control);
    this.translate.get([key]).subscribe(data => {

      //   console.log(data);

      // console.log("Return");
      // console.log(data[key]);

      error = data[key];
    })
    return error;
  }



  ngOnDestroy() {
    this.registerForm.reset();
  }

  Signupfunc() {
    this.commonP.clear();
    //this._router.navigateByUrl('register/loginDetails');
  }

  isFormValid() {
    if (!this.registerForm.valid) {
      return true;
    } else {
      false;
    }
  }

  async Login() {
    this.id = Guid.create();
    this.uniqueId = this.id.toString();

    if (!this.registerForm.valid) {
      this.submitAttempt = true;
    }
    else {
      await this.commonP.presentLoading();
      debugger
      this.SaveInfo();
      this.auth.Login(this.auth.loginobject).then(async (data: any) => {
        debugger;
        if (data?.response?.code == 1) {
          this.commonP.Set('User', JSON.stringify(data.response.content))
          if (!this.auth.data.emailStatus) {
            debugger
            // console.log(this.auth.data);
            await this.commonP.hideLoading();
            this._router.navigateByUrl("/emailOTP");
          }
          else if (!this.auth.data.mobileStatus) {
            await this.commonP.hideLoading();
            this._router.navigateByUrl("/mobileOTP");
          }
          else {
            if (this.auth.data.newDevice) {
              await this.commonP.presentLoading();
              this.translate.get(["Verify", "Cancel", "NewDeviceMSG"]).subscribe(async (data) => {
                this.commonP.showTwoButtonAlert("Device Change has been detected", data["NewDeviceMSG"], [data["Cancel"], data["Verify"]], this._router).then(async (data: any) => {
                  if (data == "Verify") {
                    await this.commonP.presentLoading();
                    this.auth.SendOTPByType(this.auth.accessToken, "SendDeviceChangedOTP").then(async (data: any) => {

                      if (data?.response?.code == 1) {
                        let navigationExtras: NavigationExtras = {
                          queryParams: {
                            type: "SendDeviceChangedOTP"
                          }
                        };
                        await this.commonP.hideLoading()
                        this._router.navigateByUrl("/mobileOTP", navigationExtras);
                      } else {
                        await this.commonP.hideLoading();
                        this.commonP.ParseErrorAlert('', '', this._router, data);
                      }
                    })
                  }
                  else {
                    this.auth.ClearDetail();
                  }
                })
              })
            }
            else {
              this.kyc.count = 0;
           
              this.kyc.GetKycStatus(this.auth.accessToken, this.auth.data.onBoardingAccount ? this.auth.data.onBoardingAccount.productId : 1).then(async (data: any) => {
                if (data.response) {
                  if (data.response.code) {
                    if (data.response.code == 1) {
                      //  this.country.countries=data.response.content;

                      if (this.kyc.totalCount > 0) {
                        let nextscreen = this.kyc.getScreen(this.kyc.count);
                        debugger;
                        if (nextscreen == "AccountType") {

                          await this.commonP.hideLoading();
                          this.commonP.Set('User', JSON.stringify(this.auth.data));
                          debugger
                          //  console.log(this.auth.data);
                          this.commonP.Set('token', data.response.token);
                          this._router.navigateByUrl("/register/AccountType");
                        }
                        else {
                          await this.commonP.hideLoading();
                          this.commonP.Set('User', JSON.stringify(this.auth.data));
                          debugger
                          //   console.log(this.auth.data);
                          this.commonP.Set('token', data.response.token);
                          if (nextscreen == "SubmitSuccess") {

                            // this.auth.GetExchangeRate(this.auth.accessToken).then((data: any) => {
                            //   if (data.response) {
                            //     if (data.response.code) {
                            //       if (data.response.code == 1) {
                                   this._router.navigateByUrl("/CurrencyExchangeRate");


                            //       }
                            //     } else {
                            //       this.commonP.ParseErrorAlert('', '', this._router, data);

                            //     }
                            //   }
                            //   else {
                            //     this.commonP.ParseErrorAlert('', '', this._router, data);

                            //   }


                            // });

                          } else {
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
        }

        else {
          if (data.error.total == 0) {
            this.commonP.hideLoading();
            this.commonP.ParseErrorAlert("", "", this._router, data);
          }
          if (data.error.response.content == "Mobile") {
            this.commonP.hideLoading();
            this.commonP.ParseErrorAlert("", "", this._router, "You can't continue from web <br/> Please continue process from mobile where you started");
          }
          else if (data.error.response.content == "Web") {
            this.commonP.hideLoading();
            this.commonP.ParseErrorAlert("", "", this._router, "You can't continue from mobile <br/> Please continue process from web");
          }
          else {
            this.commonP.hideLoading();
            this.commonP.ParseErrorAlert("", "", this._router, data)
          }
        }
      })
    }
  }

  SaveInfo() {
    var object = this.auth.loginobject;

    object.Email = this._email;
    object.Password = this._password;
    object.UniqueId = this.uniqueId;
  }

  showPopup() {
    this.Renderer2.addClass(this.Modal.nativeElement, "active");
  }
  hidePopup() {
    this.Renderer2.removeClass(this.Modal.nativeElement, "active");
  }

  showPopup2() {
    this.Renderer2.addClass(this.Modal2.nativeElement, "active");
  }
  hidePopup2() {
    this.Renderer2.removeClass(this.Modal2.nativeElement, "active");
  }
}
