
import { Country } from './countries.service';
import { ConfigService } from './config.service';
import { HttpServiceService } from './http-service.service';
import { Injectable } from '@angular/core';
import { StorageMap} from '@ngx-pwa/local-storage'
import { promise } from 'protractor';
import { resolve } from 'dns';

export interface CurrencyRate{

  ccY_Sale:string;
  ccY_Buy:string;
  rateBuy:string;
  rateSale:string;
  entryDate:string;
}
export interface RegistrationModel {

  companyId: number;
  firstName: string;
  middleName: string;
  familyName: string;
  countryID: string;
  mobileNumber: string;
  dOB: string;
  gender: string;
  nationality: string;
  dOE: string;
  documentCode: string;
  documentNumber: string;
  residenceCountry: string;
  issuer: string;
  optionalData1: string;
  optionalData2: string;
  mrtdraw: string;
  frontCardImage: string;
  backCardImage: string;
  personFaceImage: string;
  fireBaseToken: string;
  platform: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  issuedate: string;
  FatherName : string;
  CityId : number;
  BranchId : number;
  IsSpent: boolean;
  UniqueId : string;
  IsUSMobileNo : boolean;
}

export interface IdCardExpireModel{

  documentCode: string;
  frontCardImage: string;
  backCardImage: string;
  firstName: string;
  documentNumber: string;
  middleName: string;
  familyName: string;
  gender : string;
  dOB : string;
  dOE : string;
  issuer : string;
  issuedate : string;
  fullName : string;
  mrtDraw: string;
  optionalData1 : string;
  optionalData2 : string;
  fireBaseToken : string;
    personFaceImage : string;
  companyId : number;
  countryID : string;
  nationality : string;
  type : string;

}

export interface HashModel{
  IncomingObject : any,
  GeneratedHash : string;
}

export interface PageCounterModel{
  UniqueId : string;
  IpAddress : string;
  Browser : string;
  PageName : string;
  DeviceType : string;
}



export interface LoginModel{
  Email : string;
  Password : string;
  UniqueId : string;
  // GeneratedHash : string;
}

export interface OnBoardingAccount {

  accountNumber: string;
  productId: number;
  iban: string;
  accountStatus: string;
}
export interface Detail {

  fullname: string;
  emailId: string;
  mobileStatus: boolean;
  emailStatus: boolean;
  isExisting: boolean;
  userId: string;
  nationality: string;
  firstName: string;
  lastName: string;
  gender: string;
  residenceCountry: string;
  dob: Date;
  idIssuer: string;
  mobileNumber: string;
  onBoardingAccount: OnBoardingAccount;
  tokenTimeOut: number;
  newDevice: boolean;
  faceImage: string;
  PassportNationality : string;
  IsIdCardExpire : boolean;
  PersonFaceImage : string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService { 

  public platform: string = "w";
  public GetVersionUrl: string = "AppVersion/currentVersionPE";
  public RegisterURL: string = "Auth/Register";
  public LoginURL: string = "Auth/Login";
  public ResendEmailOTPURL: string = 'Auth/ResendOnboardingEmailOTP';
  public ChangeOnboardingEmail: string = "Auth/ChangeEmail";
  public ChangeOnboardingMobile: string = "Auth/ChangeMobile";
  public VerifyOnboardingEmail: string = "Auth/verifyEmailOTP";
  public VerifyOnboardingMobile: string = "Auth/verifyMobileOTP";
  public SendOnboardingMobileOTPURL: string = "Auth/sendOnboardingMobileOTP";
  public SendOTPByTypeURL: string = "Auth/sendotptoken";
  public VerifyOTPByTypeURL: string = "Auth/verifyOtpByType";
  public SaveTempImageUrl: string = "Auth/savetempImage";
  public IdCardSaveURL: string = "IdCard/Save";
  public Savepagecounterurl : string = "Auth/SavePageCount";
  public residenceCountry: string;
  public accessToken: string;
  public checkemailURL : string = "Auth/checkEmail";
  ipaddressurl : string = ''
  public GetExchangeRateURL : string = "Auth/GetExchangeRate";



  public CurrencyRate:CurrencyRate[]=[];
   public data: Detail = {
    faceImage: "",
    newDevice: false,
    onBoardingAccount: {
      iban: "",
      accountStatus: "",
      accountNumber: "",
      productId: 1
    },
    fullname: "",
    emailId: "",
    mobileNumber: "",
    mobileStatus: false,
    emailStatus: false,
    isExisting: false,
    userId: "",
    nationality: "",
    firstName: "",
    residenceCountry: "",
    lastName: "",
    gender: "",
    dob: new Date(),
    idIssuer: "",
    tokenTimeOut: null,
    PassportNationality : "",
    IsIdCardExpire : false,
    PersonFaceImage : "",
  };

  public registrationObject: RegistrationModel = {
    backCardImage: "",
    familyName: "",
    fireBaseToken: "",
    firstName: "",
    frontCardImage: "",
    fullName: "",
    dOB: "",
    dOE: "",
    documentCode: "",
    documentNumber: "",
    email: "",
    residenceCountry: "",
    issuer: "",
    optionalData1: "",
    optionalData2: "",
    middleName: "",
    mobileNumber: "",
    mrtdraw: "",
    nationality: "",
    companyId: 1,
    confirmPassword: "",
    countryID: "",
    password: "",
    personFaceImage: "",
    platform: "",
    gender: "",
    issuedate: "",
    FatherName: "",
    CityId: null,
    BranchId: null,
    IsSpent : true,
    UniqueId : "",
    IsUSMobileNo : false,
  };
  
  public SaveCounterobject : PageCounterModel = {
    Browser : '',
    DeviceType : '',
    IpAddress : '',
    PageName : '',
    UniqueId : '',
  }

  public IdCardObject : IdCardExpireModel = {
    backCardImage : "",
    companyId : 1,
    countryID : "",
    dOB : "",
    dOE : "",
    documentCode : "",
    documentNumber : "",
    familyName : "",
    fireBaseToken : "",
    firstName : "",
    frontCardImage : "",
    fullName : "",
    gender : "",
    issuedate : "",
    issuer : "",
    middleName : "",
    mrtDraw : "",
    nationality : "",
    optionalData1 : "",
    optionalData2 : "",
    personFaceImage : "",
    type : ""
  }

  public loginobject : LoginModel = {
    Email : '',
    Password : '',
    UniqueId : '',
    // GeneratedHash : '',
  }

  public selectedCountry: Country = {
    mask: '',
    mobileLength: 0,
    isActive: false,
    isBlink: false,
    isColorTest: false,
    isFeatured: false,
    isMobile: false,
    isStayAllowed: false,
    isoCode: '',
    isoCode3: '',
    countryName: '',
    createdDate: new Date(),
    crossAllowed: false,
    featureOrder: 0,
    flagClass: '',
    foriegnIssuerAllowed: false,
    foriegnNationalityAllowed: false,
    primaryIssuerAllowed: false,
    primaryNationalityAllowed: false,
    idLength: 9,
    mobileCode: '',
    mobileOperators: [],
    nationality: '',
    twoParts: false,
    mobileMaxLength : 0
  }

  constructor(
    private http: HttpServiceService,
    private config: ConfigService,
    private storagemap : StorageMap
  ) {
  }

  Get(key: string): Promise<any> {
    console.log("Key");
    console.log(key);

    return new Promise((resolve) => {
      this.storagemap.get(key)
        .subscribe(value => {
          console.log("Value Found");
          console.log(value);
          if (value) {
            resolve(value);
          }
          else {
            resolve("");
          }
        }, error => {
          console.log("Eror in Get");
          console.log(error);
          resolve("");
        })
    })

  }
  
  delete(Key : string) : Promise<any>{
    return new Promise((resolve) => {
      this.storagemap.delete(Key);
    })
  }

  public ClearDetail() {
    this.data = {
      faceImage: "",
      newDevice: false,
      onBoardingAccount: {
        iban: "",
        accountStatus: "",
        accountNumber: "",
        productId: 0
      },
      fullname: "",
      emailId: "",
      mobileNumber: "",
      mobileStatus: false,
      residenceCountry: "",
      emailStatus: false,
      isExisting: false,
      userId: "",
      nationality: "",
      firstName: "",
      lastName: "",
      gender: "",
      dob: new Date(),
      idIssuer: "",
      tokenTimeOut: 0,
      PassportNationality: "",
      IsIdCardExpire : false,
      PersonFaceImage : "",
    };
  }

  public SaveTempImage(token, image) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.config.server + this.SaveTempImageUrl,
        { Image: image }, token).subscribe((data: any) => {
          if (data.response) {
            if (data.response.code) {
              if (data.response.code == 1) {
                //    this.data.emailStatus=data.response.content;
              }
            }
          }
          resolve(data);
        },
          Error => {
            resolve(Error);
          })
    });
  }

  // public getip(){
  //   return this.http.postToOpenApi( this.ipaddressurl , "");
  // }

  public ChangeEmailOnboarding(emailId, token) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.config.server + this.ChangeOnboardingEmail,
        { EmailId: emailId }, token).subscribe((data: any) => {
          if (data.response) {
            if (data.response.code) {
              if (data.response.code == 1) {
                //    this.data.emailStatus=data.response.content;
              }
            }
          }
          resolve(data);
        },
          Error => {
            resolve(Error);
          })
    });
  }

  public SavePageCounter(object) {
    return new Promise((resolve, reject) => {
      this.http.postToOpenApi(this.config.server + this.Savepagecounterurl, object).subscribe((data: any) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              this.data = data.response.content;
            }
          }
        }
        resolve(data);
      },
        Error => {
          resolve(Error);
        })
    })
  }

  public CheckEmail(emailId, token) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.config.server + this.checkemailURL,
        { EmailId: emailId }, token).subscribe((data: any) => {
          if (data.response) {
            if (data.response.code) {
              if (data.response.code == 1) {
                //    this.data.emailStatus=data.response.content;
              }
            }
          }
          resolve(data);
        },
          Error => {
            resolve(Error);
          })
    });
  }

  public ChangeMobileOnboarding(mobile, token) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.config.server + this.ChangeOnboardingMobile,
        { mobileNumber: mobile }, token).subscribe((data: any) => {
          if (data.response) {
            if (data.response.code) {
              if (data.response.code == 1) {
                //    this.data.emailStatus=data.response.content;
              }
            }
          }
          resolve(data);
        },
          Error => {
            resolve(Error);
          })
    });
  }

  public VerifyEmailOnboarding(otp, token) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.config.server + this.VerifyOnboardingEmail,
        { otpCode: otp }, token).subscribe((data: any) => {
          if (data.response) {
            if (data.response.code) {
              if (data.response.code == 1) {
                //    this.data.emailStatus=data.response.content;
              }
            }
          }
          resolve(data);
        },
          Error => {
            resolve(Error);
          })
    });
  }

  public GetExchangeRate(token,uniqueId) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.config.server + this.GetExchangeRateURL,
        { UniqueId:uniqueId }, token).subscribe((data: any) => {
          if (data.response) {
            if (data.response.code) {
              if (data.response.code == 1) {
                this.CurrencyRate=data.response.content;
                //    this.data.emailStatus=data.response.content;
              }
            }
          }
          resolve(data);
        },
          Error => {
            resolve(Error);
          })
    });
  }


  public VerifyMobileOnboarding(otp, token) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.config.server + this.VerifyOnboardingMobile,
        { otpCode: otp }, token).subscribe((data: any) => {
          if (data.response) {
            if (data.response.code) {
              if (data.response.code == 1) {
                //    this.data.emailStatus=data.response.content;
              }
            }
          }
          resolve(data);
        },
          Error => {
            resolve(Error);
          })
    });
  }


  public SendOnboardingMobileOTP(token) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.config.server + this.SendOnboardingMobileOTPURL, {}, token).subscribe((data: any) => {
          if (data.response) {
            if (data.response.code) {
              if (data.response.code == 1) {
                //    this.data.emailStatus=data.response.content;
              }
            }
          }
          resolve(data);
        },
          Error => {
            resolve(Error);
          })
    });
  }

  public ResendOTP(token) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(this.config.server + this.SendOnboardingMobileOTPURL, {}, token)
        .subscribe((data: any) => {
          if (data.response) {
            if (data.response.code) {
              if (data.response.code == 1) {
                //this.data=data.response.content;
              }
            }
          }
          resolve(data);
        },
          Error => {
            resolve(Error);
          })
    });
  }

  public ResendMobileOTP(token) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(this.config.server + this.ResendEmailOTPURL, {}, token)
        .subscribe((data: any) => {
          if (data.response) {
            if (data.response.code) {
              if (data.response.code == 1) {
                //this.data=data.response.content;
              }
            }
          }
          resolve(data);
        },
          Error => {
            resolve(Error);
          })
    });
  }

  public clearRegistrationObject() {

    this.registrationObject = {
      backCardImage: "",
      familyName: "",
      fireBaseToken: "",
      firstName: "",
      frontCardImage: "",
      fullName: "",
      dOB: "",
      dOE: "",
      documentCode: "",
      documentNumber: "",
      email: "",
      residenceCountry: "",
      issuer: "",
      optionalData1: "",
      optionalData2: "",
      middleName: "",
      mobileNumber: "",
      mrtdraw: "",
      nationality: "",
      companyId: 1,
      confirmPassword: "",
      countryID: "",
      password: "",
      personFaceImage: "",
      platform: "",
      gender: "",
      issuedate: "",
      FatherName: "",
      CityId: null,
      BranchId : null,
      IsSpent : true,
      UniqueId: "",
      IsUSMobileNo : null,
    };
  }


  public GetVersion() {

    return new Promise((resolve, reject) => {
      // this.http.getFromOpenApi('https://retailbackend.gslb.uat.eradahcapital.com/api/',this.GetVersionUrl+"?Platform="+(this.platform.is('android')?"A":"I")).subscribe((data)=>{
      //   console.log("Google");
      //   console.log(data);
      // })
      debugger;
      this.http.getFromOpenApi(
        this.config.server, this.GetVersionUrl + "?Platform=" + "A" )
        .subscribe((data) => {
          debugger;
          resolve(data);
        },
          Error => {
            resolve(Error);
          })
    })
  }

  public Login(object) {

    return new Promise((resolve, reject) => {
      debugger
      let hashobject : HashModel = {
        IncomingObject : object,
        GeneratedHash : ''
      }
      this.http.postToOpenApi(this.config.server + this.LoginURL, this.loginobject ).subscribe((data: any) => {
          if (data.response) {
            if (data.response.code) {
              if (data.response.code == 1) {
                this.data = data.response.content;
              }
            }
          }
          resolve(data);
        },
          Error => {
            resolve(Error);
          })
    });
  }

  public Register() {
    debugger
    return new Promise((resolve, reject) => {
      // this.registrationObject.companyId = 1;
      // this.registrationObject.residenceCountry = this.residenceCountry;
      this.http.postToOpenApi( this.config.server + this.RegisterURL , this.registrationObject).subscribe((data: any) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              this.data = data.response.content;
            }
          }
        }
        resolve(data);
      },
        Error => {
          resolve(Error);
        })
    });
  }

  public SaveIdCard(token, object) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(this.config.server + this.IdCardSaveURL, object, token)
        .subscribe((data: any) => {
          if (data.response) {
            if (data.response.code) {
              if (data.response.code == 1) {
                //    this.data.emailStatus=data.response.content;
              }
            }
          }
          resolve(data);
        },
          Error => {
            resolve(Error);
          })
    });
  }

  public SendOTPByType(token, type) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(this.config.server + this.SendOTPByTypeURL,
        { Type: type }, token)
        .subscribe((data: any) => {
          if (data.response) {
            if (data.response.code) {
              if (data.response.code == 1) {
                //    this.data.emailStatus=data.response.content;
              }
            }
          }
          resolve(data);
        },
          Error => {
            resolve(Error);
          })
    });
  }

  public VerifyOTPByType(token, type, otp) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(this.config.server + this.VerifyOTPByTypeURL,
        { Type: type, OTPCode: otp }, token)
        .subscribe((data: any) => {
          if (data.response) {
            if (data.response.code) {
              if (data.response.code == 1) {
                //    this.data.emailStatus=data.response.content;
              }
            }
          }
          resolve(data);
        },
          Error => {
            resolve(Error);
          })
    });
  }

  RegisterSession(token) {
    console.log("Register Session=>", token);
    this.accessToken = token
  }
}
