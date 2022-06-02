import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service';
import { ConfigService } from './config.service';
import { AuthService } from "./auth.service";

export interface ScenarioOrder {
  type: string;
  status: boolean;
  error: string;
  isOPtional: boolean;
}

export interface ComboV1Values{
  UniqueId: string;
  Type : string;
}

@Injectable({
  providedIn: 'root'
})

export class KycService {

  public GetKycStatuURL: string = "kyc/getstatusv2";
  public SaveAddressURL: string = "ResidentialInformation/ResidentialInformation";
  public SaveAccountKycURL: string = "Kyc/AccountKYCInfo";
  public SaveDocs: string = "AdditionalDocs/SaveAdditionalDocs";
  public SaveFatcaURL: string = "FatcaCrs/FatcaCrs";
  public GetComboValuesURL: string = "ResidentialInformation/GetComboValues";
  public GetComboValuesV2URL: string = "ResidentialInformation/GetComboValuesV2";
  public GetComboValuesV1URL: string = "ResidentialInformation/GetComboValuesV1";
  public GetCountryCityValuesV1URL : string = "ResidentialInformation/GetCountryCityValuesV1";
  public SaveTransactionURL: string = "AgentQuestionair/AgentQuestionairResponse";
  public CreateAccountURL: string = "LinkAccount/OpenAccount";
  public videoToken: string = "";
  public videoSession: string = "";
  ISPassportskip: boolean = true;
  public ScenarioOrder: ScenarioOrder[] = [];
  count: number = 0;
  totalCount: number = 0;
  isExpireFlow: boolean = false;
  expireMsg: string = "";


  constructor(
    private http: HttpServiceService, 
    private ConfigService: ConfigService,
    private auth : AuthService,
    ) { }

  public V1Valueobject : ComboV1Values  = {
    Type : "",
    UniqueId : '',
  }

  public OpenAccount(token, object) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.ConfigService.server + this.CreateAccountURL, object, token).subscribe((data) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              console.log(data);
              //     this.data=data.response.content;
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

  public SaveAddressInfo(token, object) {
    
    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.ConfigService.server + this.SaveAddressURL, object, token).subscribe((data) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              console.log(data);
              //     this.data=data.response.content;
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

  public SaveAdditioanlDocs(token, object) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.ConfigService.server + this.SaveDocs, object, token).subscribe((data) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              console.log(data);
              //     this.data=data.response.content;
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

  public SaveTransaction(token, object) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.ConfigService.server + this.SaveTransactionURL, object, token).subscribe((data) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              console.log(data);
              //     this.data=data.response.content;
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

  public SaveFatca(token, object) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.ConfigService.server + this.SaveFatcaURL, object, token).subscribe((data) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              console.log(data);
              //     this.data=data.response.content;
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

  public SaveAccountKyc(token, object) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.ConfigService.server + this.SaveAccountKycURL, object, token).subscribe((data) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              console.log(data);
              //     this.data=data.response.content;
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


  public GetComboValues(token, productId = 1) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.ConfigService.server + this.GetComboValuesURL, { ProductId: productId }, token).subscribe((data) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              console.log(data);
              //     this.data=data.response.content;
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

  public GetComboValuesV1() {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.ConfigService.server + this.GetComboValuesV1URL,this.V1Valueobject,this.auth.accessToken).subscribe((data : any) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              console.log(data);
              //     this.data=data.response.content;
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

  public GetComboValuesV2() {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.ConfigService.server + this.GetComboValuesV2URL , this.V1Valueobject,this.auth.accessToken).subscribe((data : any) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              console.log(data);
              //     this.data=data.response.content;
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

  public GetCountryCityValuesV1() {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.ConfigService.server + this.GetCountryCityValuesV1URL , this.V1Valueobject,this.auth.accessToken).subscribe((data : any) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              console.log(data);
              //     this.data=data.response.content;
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



  public GetKycStatus(token, productId = 1) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(
        this.ConfigService.server + this.GetKycStatuURL, { ProductId: productId }, token).subscribe((data) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              console.log(data);
              this.ScenarioOrder = data.response.content.data;
              this.totalCount = this.ScenarioOrder.length;
              //     this.data=data.response.content;
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


  getScreen(numbers) {
    let result = "";
    let bool = false;
    this.isExpireFlow = false;
    this.expireMsg = "";
    while (!bool) {
      debugger;
      console.log(this.count);
      if (this.count < this.totalCount) {
        let screen = this.ScenarioOrder[this.count];
        if (screen.type == "PassportNumberC" || screen.type == "PassportNumberG") {
          if (screen.status) {
            this.count = this.count + 1;
          }
          else {
            if (screen.isOPtional) {
              this.ISPassportskip = true;
            }
            else {
              this.ISPassportskip = false;
            }
            bool = true;
            result = "PassportNumberPage";
          }
        }
        else if (screen.type == "Passport" || screen.type == "PassportG") {
          if (screen.status) {
            this.count = this.count + 1;
          }
          else {
            if (screen.isOPtional) {
              this.ISPassportskip = true;
            }
            else {
              this.ISPassportskip = false;
            }
            if (screen.error) {
              this.isExpireFlow = true;
              //alert(screen.error);
              this.expireMsg = "PassportExpireMessage"
            }
            bool = true;
            result = "PassportDetails";
          }
        }
        else if (screen.type == "ForiegnIDCard") {
          if (screen.status) {
            this.count = this.count + 1;
          }
          else {
            if (screen.error) {
              this.isExpireFlow = true;
              //alert(screen.error);
              this.expireMsg = "FIDExpireMessage"
            }
            bool = true;
            result = "/scan-foreign-id";
          }
        }
        else if (screen.type == "IDCard" ) {
          // || screen.type == "IDCardG"
          if (screen.status) {
            console.log("Inside IDCARD");
            this.count = this.count + 1;
            console.log(this.count);
          }
          else {
            if (screen.error) {
              this.isExpireFlow = true;
              //alert(screen.error);
              this.expireMsg = "IdExpireMessage"
            }
            bool = true;
            result = "PakistanNationalityDetails";
            // if (screen.type == "IDCardG") {
            //   /* if (this.auth.GIsSaudi) {
            //      result = "IdSaudiCapturePage";
            //    }
            //    else {*/

            //   //   if(this.config.GccAllowed.toLowerCase()=="true"){
            //   //   result = "GChooseCountryPage";
            //   // }else{
            //   //  result = "IdScanIntroPage";

            //   //}

            //   //}
            // }
            // else {
            //   //if (this.auth.IsSaudi) {
            //   //   result = "IdSaudiCapturePage";

            //   //   }
            //   //  else {
            //   //    result = "IdScanIntroPage";

            //   //   }

            //   // result = "PakistanNationalityDetails";
            // }
          }
        }
        else if (screen.type == "ProductSelection") {

          if (screen.status) {
            this.count = this.count + 1;
          }
          else {
            bool = true;
            result = "AccountType";
          }

        }
        else if (screen.type == "AdditionalDocs") {

          if (screen.status) {
            this.count = this.count + 1;
          }
          else {
            bool = true;
            result = "SupportingDocuments";
          }

        }
        else if (screen.type == "AccountKyc") {
          if (screen.status) {
            this.count = this.count + 1;
          }
          else {
            bool = true;
            result = "AdditionalDetails";

          }
        }
        else if (screen.type == "AdditioanalInfo") {
          if (screen.status) {
            this.count = this.count + 1;
          }
          else {
            bool = true;
            result = "TellUsMoreAboutYourself1";
          }
        }
        else if (screen.type == "ForiegnBankDetails") {
          if (screen.status) {
            this.count = this.count + 1;
          }
          else {
            bool = true;
            result = "YourForeignBankDetails";
          }
        }
        else if (screen.type == "VideoCall" || screen.type == "VideoCallG") {
          if (screen.status) {
            this.count = this.count + 1;
          }
          else {
            bool = true;
            result = "SubmitSuccess";
          }
        }
        else if (screen.type == "FatcaCrs") {
          if (screen.status) {
            this.count = this.count + 1;
          } else {

            bool = true;
            result = "CrsFatcaDeclaration";
          }
        }
        else if (screen.type == "BankingTransaction") {
          if (screen.status) {
            this.count = this.count + 1;
          } else {

            bool = true;
            result = "SubmitSuccess";
          }
        }
        else if (screen.type == "AccountCreation") {
          if (screen.status) {
            this.count = this.count + 1;
          } else {
            bool = true;
            result = "SubmitSuccess";
          }
        }
        else if (screen.type == "IAgree") {
          if (screen.status) {
            this.count = this.count + 1;
          }
          else {
            bool = true;
            result = "TermandconditionPage";
          }
        }
        else if (screen.type == "Cong") {
          if (screen.status) {
            this.count = this.count + 1;
          }
          else {
            bool = true;
            result = "ConactivedPage";
          }
        }
        else if (screen.type == "MobileOTP") {
          if (screen.status) {
            this.count = this.count + 1;
          } else {
            bool = true;
            result = "VerifyCustomer";
          }
        }
        else if (screen.type == "Dashboard") {
          if (screen.status) {
            this.count = this.count + 1;
          } else {
            bool = true;
            result = "Dashborad12Page";
          }
        }
        else {
          bool = true;
          result = "Dashborad12Page";
        }

      }
      else {
        bool = true;
        result = "Dashborad12Page";
      }
    }
    return result;
  }
}
