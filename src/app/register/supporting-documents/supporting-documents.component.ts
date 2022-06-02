import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { AdditionalFieldsModel, AdditionalFieldsService, AdditionalDocs } from '../../Services/additional-fields.service';
import { CommonService } from '../../Services/common.service'
import { Router } from '@angular/router'
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ErrorMessageKeyService } from '../../Services/error-message-key.service';
import * as _ from 'lodash';
import { KycService } from '../../Services/kyc.service'
export interface DocList{
  ImageId:string;
  docId:string;
  docType:string;
}
@Component({
  selector: 'app-supporting-documents',
  templateUrl: './supporting-documents.component.html',
  styleUrls: ['./supporting-documents.component.scss']
})
export class SupportingDocumentsComponent implements OnInit {

  counter: string;
  current: string;
  max: string;
  config: AdditionalFieldsModel[] = [];
  DocsObject: AdditionalDocs[] = [];
  DocsObject2:DocList[]=[];
  submitAttempt: boolean = false;
  imageError: string = null;
  cardImageBase64: string;
  image64: string[];
  imagebase64: string;
  isImageSaved: boolean;
  Image;
  SelectedOption = null;
  Array: string[];
  Array2: string[];
  loginResponse;
  lableofarray;
  myStyle;

  @ViewChild('takeinput', { static: false })  InputVar: ElementRef;
  @ViewChild("imageid") imagetag : ElementRef;
  @ViewChild("modal") Modal: ElementRef;

  constructor(
    public formbuilder: FormBuilder,
    public translate: TranslateService,
    public _adddoc: AdditionalFieldsService,
    private auth: AuthService,
    private common: CommonService,
    private _router: Router,
    public errorKey: ErrorMessageKeyService,
    private sanitizer: DomSanitizer,
    private kyc: KycService,
    public renderer: Renderer2,
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  async ngOnInit(): Promise<void> {

    this.counter = "3";
    this.current = "11";
    this.max = "13";

    this.auth.accessToken = await this.auth.Get('token');
    this.loginResponse = JSON.parse(await this.common.Get('User'));
    this.auth.data.onBoardingAccount.productId = this.loginResponse.onBoardingAccount.productId;
    
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
              if (nextscreen == "SupportingDocuments") {
                this._adddoc.GetAddDocConfig(this.auth.accessToken).then((data: any) => {
                  if (data?.response?.code == 1) {
                    debugger
                    this.config = data.response.content.list;
                    this.Array2 = data.response.content.list;
                    this.DocsObject = data.response.content.list;

                    console.log(this.lableofarray)
                    console.log(this.config);
                    this.common.hideLoading();
                    console.log(this.SelectedOption)
                  }
                  else {
                    this.common.hideLoading();
                    this.common.ParseErrorAlert("", "", this._router, data);
                  }
                });
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

  hidePopup() {
    this.renderer.removeClass(this.Modal.nativeElement, "active");
  }

  showPopup() {
    this.renderer.addClass(this.Modal.nativeElement, "active");
  }

  PostToTempImage(data, identifier) {
    debugger
    this.common.presentLoading();
    this.Image = data;
    return new Promise((resolve, reject) => {
      this.auth.SaveTempImage(this.auth.accessToken, this.Image).then((data: any) => {
        if (data?.response?.code == 1) {
          this.common.hideLoading();
          if(identifier.testDoc == 'ProofNRP'){
            this.DocsObject2[1] = {docId:identifier.listofadddoc[0].docId,docType: identifier.listofadddoc[0].documentType,ImageId:data.response.content.id};
          }
          else if(identifier.testDoc == 'Sign'){
            this.DocsObject2[2] = {docId:identifier.listofadddoc[0].docId,docType: identifier.listofadddoc[0].documentType,ImageId:data.response.content.id};
           // this.DocsObject2[2] = [identifier.listofadddoc[0].docId,identifier.listofadddoc[0].documentType,data.response.content.id];
          }else if(identifier.testDoc == 'Headpic'){
         //   this.DocsObject2[3] = [identifier.listofadddoc[0].docId,identifier.listofadddoc[0].documentType,data.response.content.id];
         this.DocsObject2[3] = {docId:identifier.listofadddoc[0].docId,docType: identifier.listofadddoc[0].documentType,ImageId:data.response.content.id};
        }
          // else if(identifier.testDoc = 'ProofNRP')
          // if (identifier == 'ProofNRP') {
          //   debugger
          //   this._adddoc.DocsObject.arrayofids[0] = data.response.content.id;
          // }
          // else if (identifier == 'Sign') {
          //   debugger
          //   this._adddoc.DocsObject.arrayofids[1] = data.response.content.id;
          // }
          // else if (identifier == 'Headpic') {
          //   debugger
          //   this._adddoc.DocsObject.arrayofids[2] = data.response.content.id;
          // }
          console.log(this.DocsObject2);
          resolve(data);
        }
        else {
          this.common.hideLoading();
          this.common.ParseErrorAlert("", "", this._router, data);
        }
      },
        Error => {
          resolve(Error);
        })
    });
  }

  // popselect(){
  //   this.myStyle="{col-8}"


  //   // for(var i=0 ; i<this.DocsObject.length; i++){
  //   //   for(var s=0; s<this.DocsObject[i].listofadddoc.length; s++){
  //   //     if(this.SelectedOption.docId == this.DocsObject[i].listofadddoc[s].docId){
  //   //       this.DocsObject2[0].docId = this.SelectedOption.docId
  //   //     }
  //   //   }
  //   // }
  // }

  SaveToTempImage(index) {
    this.common.presentLoading();
    if(index == 0){
      this.PostToTempImage(this.imagebase64, '').then((data : any) => {
        this.common.hideLoading();
        debugger
        this.DocsObject2[0] = {docId:this.SelectedOption.docId,docType: this.SelectedOption.documentType,ImageId:data.response.content.id};
        //this.DocsObject2[0] = [this.SelectedOption.docId, this.SelectedOption.documentType, data.response.content.id]
        console.log(this.DocsObject2[0]);
        // this.DocsObject2[0].documentType = this.SelectedOption.documentType;
        // this.DocsObject2[0].image = data.response.content.id;
      })
    }
    
    
    // if (this.SelectedOption.docId == 'POP') {
    //   if (this.SelectedOption.documentType == 'Salary Certificate') {
    //     debugger
    //     this.PostToTempImage(this.imagebase64, '').then((data: any) => {
    //       if (data?.response?.code == 1) {
    //         this.common.hideLoading();
    //         this._adddoc.DocsObject.arrayofids[3] = data.response.content.id;
    //       }
    //     });
    //   }
    //   else if (this.SelectedOption.documentType == 'Salary Slip') {
    //     debugger
    //     this.PostToTempImage(this.imagebase64, '').then((data: any) => {
    //       if (data?.response?.code == 1) {
    //         this.common.hideLoading();
    //         this._adddoc.DocsObject.slryslipPop = data.response.content.id;
    //       }
    //     });
    //   }
    //   else if (this.SelectedOption.documentType == 'Account Statement') {
    //     debugger
    //     this.PostToTempImage(this.imagebase64, '').then((data: any) => {
    //       if (data?.response?.code == 1) {
    //         this.common.hideLoading();
    //         this._adddoc.DocsObject.AccstatPop = data.response.content.id;
    //       }
    //     });
    //   }
    // }
  }

  isFormValid() {
    debugger
    //var object = this._adddoc.DocsObject;
    if (this.DocsObject2[0] != null && this.DocsObject2[1] != null 
          && this.DocsObject2[2] != null && this.DocsObject2[3] != null) {
      return false;
    }
    else {
      return true;
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

  removeImage1() {
    debugger
    this.DocsObject2[0] = null;
    this.InputVar.nativeElement.value = "";
    this.cardImageBase64 = null;
    this.isImageSaved = false;
    this.renderer.removeClass(this.Modal.nativeElement, "active");
    // this.InputVar.nativeElement.value = "";
    // this._adddoc.DocsObject.slryslipPop = "";
    // this._adddoc.DocsObject.SlryCrtfPoP = "";
    // this._adddoc.DocsObject.AccstatPop = "";
    // this.cardImageBase64 = null;
    // this.isImageSaved = false;
    // this.SelectedOption = null;
  }

  RemoveFunction(identifier) {

    if (identifier.testDoc == 'ProofNRP') {
      this.DocsObject2[1] = null;
    }
    else if (identifier.testDoc == 'Sign') {
      this.DocsObject2[2] = null;
    } else if (identifier.testDoc == 'Headpic') {
      this.DocsObject2[3] = null;
    }
  }

  formpost() {
    this.common.presentLoading();
    this.SaveInfo();
    this._adddoc.SaveAdditionalDocs(this.auth.accessToken, {List : this.DocsObject2, ProductId : this.loginResponse.onBoardingAccount.productId}).then((data: any) => {
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
        debugger
        this.common.hideLoading();
        this.common.ParseErrorAlert("", "", this._router, data);
      }
    });
  }

  formpostdolater() {
    this.common.showDoLaterAlert(this._router).then((data) => {
      if (data == "Logout") {
        this.SaveInfo();
        this.common.presentLoading();
        debugger;
        this._adddoc.SaveAdditionalDocs(this.auth.accessToken, {List : this.DocsObject2, ProductId : this.loginResponse.onBoardingAccount.productId}).then((data: any) => {
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

  SavingImage(fileInput: any, index) {
    debugger
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 5000000;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 2229;
      const max_width = 8386;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError =
          'Maximum size allowed is 5 MB';

        return false;
      }

      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
        this.imageError = 'Please upload a valid JPEG, PNG or JPG format. Max size: 5 MB';
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          console.log(img_height, img_width);


          if (img_height > max_height && img_width > max_width) {
            this.imageError =
              'Maximum dimentions allowed ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            this.image64 = this.cardImageBase64.split(',');
            this.imagebase64 = this.image64[1];
            this.isImageSaved = true;
            if (this.isImageSaved) {
               this.SaveToTempImage(index);

               this.renderer.setAttribute(this.imagetag.nativeElement,'src',this.image64[0] + ',' + this.image64[1]);

            }
            // this.previewImagePath = imgBase64Path;
          }
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  SaveInfo() {
    var object = this._adddoc.DocsObject;
    // object.POA = "";
    // object.Visa = "";
    
    // object.arrayofids[0] = 'sasasas';
    // object.arrayofids[1] = 'asdasdasd';
  }

}
