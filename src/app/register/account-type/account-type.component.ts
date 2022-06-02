import { Component, OnInit, Renderer2, ElementRef, ViewChild, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Product, ProductService } from '../../Services/product.service';
import { CommonService } from '../../Services/common.service'
import { Router } from '@angular/router'
import { ErrorMessageKeyService } from '../../Services/error-message-key.service';
import { Guid } from "guid-typescript";
import { KycService } from '../../Services/kyc.service'
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss']
})
export class AccountTypeComponent implements OnInit {

  counter: string;
  current: string;
  max: string;
  Mainheading: string;
  description: string;
  product: Product;
  accountform: FormGroup;
  prod: Product[] = [];
  submitAttempt: boolean = false;
  prod1value: string;
  prod2value: string;
  uniqueId: Guid;
  id: string;
  token;
  productid;
  accnature;
  acctype;
  productwithoutcurrency: string = "";
  prod1valueselect : string = null;
  productwithcurrency: string = "";
  text;

  @ViewChild("modalOne") modalOne: ElementRef;
  @ViewChild("modalTwo") modalTwo: ElementRef;

  constructor(
    public formbuilder: FormBuilder,
    public translate: TranslateService,
    public renderer: Renderer2,
    private prodservice: ProductService,
    private auth: AuthService,
    private common: CommonService,
    private _router: Router,
    public errorKey: ErrorMessageKeyService,
    public kyc: KycService,
    private location: LocationStrategy

  ) {

    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });

    translate.setDefaultLang('en');
    translate.use('en');

  }

  async ngOnInit(): Promise<void> {

    this.accountform = this.formbuilder.group({
      NOA: ['', Validators.compose([Validators.required])],
      TOA: ['', Validators.compose([Validators.required])],
      productwithoutcurrency: [''],
      productwithcurrency: [''],
    })

    this.counter = "2";
    this.current = "5";
    this.max = "13";
    this.uniqueId = Guid.create();
    this.id = this.uniqueId.toString();

    this.auth.accessToken = await this.auth.Get('token');
    this.accountform.patchValue({'productwithoutcurrency' : null});
    this.accountform.patchValue({'productwithcurrency' : null});

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
              if (nextscreen == "AccountType") {
                
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

  Onselect() {
    debugger
    var NOA = this.accountform.get('NOA').value;
    var TOA = this.accountform.get('TOA').value;
    
    this.accountform.patchValue({'productwithoutcurrency' : ''});
    this.accountform.patchValue({'productwithcurrency' : ''});
    if (NOA != '' && TOA != '') {
      this.GetProduct();
      this.prod1value = null;
      this.prod1valueselect = null;
    }
  }

  GetProduct() {
    debugger;
    var NOA = this.accountform.get('NOA').value;
    var TOA = this.accountform.get('TOA').value;

    this.common.presentLoading();
    this.prodservice.GetProductsGroupWise(this.auth.accessToken, NOA, TOA).then((data: any) => {
      if (data?.response?.code == 1) {
        debugger
        this.common.hideLoading();
        this.prod = data.response.content.list;
        this.text = true;
        console.log(this.prod);
      }
      else {
        this.common.hideLoading();
        this.common.ParseErrorAlert("", "", this._router, data);
      }
    });
  }

  accountpostdolater() {
    // this.common.hideLoading();
    this.common.showDoLaterAlert(this._router).then((data) => {
      if (data == "Logout") {
        this.saveinfo();
        this.common.presentLoading();
        debugger;
        this.prodservice.SaveOnBoaridngProduct(
          this.auth.accessToken, this.productid).then((data: any) => {
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

  accountpost() {
    this.common.presentLoading();
    this.saveinfo();
    debugger
    this.prodservice.SaveOnBoaridngProduct(
      this.token, this.productid).then((data: any) => {
        if (data?.response?.code == 1) {
          debugger
          this.auth.data.onBoardingAccount.productId = data.response.content.id;
          this.common.Set('User', JSON.stringify(this.auth.data));
          this.kyc.count = 0;
          this.kyc.GetKycStatus(this.auth.accessToken, this.auth.data.onBoardingAccount ? this.auth.data.onBoardingAccount.productId : 1).then(async (data: any) => {
            if (data.response) {
              if (data.response.code) {
                if (data.response.code == 1) {
                  //  this.country.countries=data.response.content;

                  if (this.kyc.totalCount > 0) {
                    let nextscreen = this.kyc.getScreen(this.kyc.count);
                    debugger;
                    // if (nextscreen == "dashboard") {
                    //   this._router.navigateByUrl("/register/AccountType");
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
          // this._router.navigateByUrl('/PassportDetails');
        }
        else {
          this.common.hideLoading();
          this.common.ParseErrorAlert("", "", this._router, data);
        }
      })
  }

  saveinfo(): void {
    debugger
    this.token = this.auth.accessToken;
    var check = this.accountform.get('productwithoutcurrency').value

    if (check != "") {
      this.productid = this.accountform.get('productwithoutcurrency').value
    }
    else if (check == "") {
      this.productid = this.accountform.get('productwithcurrency').value
    }

    this.accnature = this.accountform.get('NOA').value;
    this.acctype = this.accountform.get('TOA').value;
  }

  openPdf() {
    window.open("../../../assets/CRS-form-Individual.pdf", '_blank');
  }

  showPopup(e) {
    if (e == 1) {
      this.renderer.addClass(this.modalOne.nativeElement, "active");
    } else {
      this.renderer.addClass(this.modalTwo.nativeElement, "active");
    }
  }

  hidePopup(e) {
    if (e == 1) {
      this.renderer.removeClass(this.modalOne.nativeElement, "active");
    } else {
      this.renderer.removeClass(this.modalTwo.nativeElement, "active");
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
    if (!this.accountform.valid) {
      return true;
    } else {
      if (this.accountform.get('productwithcurrency').value == '' && this.accountform.get('productwithoutcurrency').value == '') 
      { 
        return true 
      }
      // if(this.productwithcurrency == '' && this.productwithoutcurrency != ''){
      //   return false
      // }
      else{
        return false;
      }
    }
  }

  Assignvalue() {
    this.prod1value = "something"
    this.accountform.patchValue({ productwithoutcurrency: "" });
    this.productwithcurrency = this.accountform.get('productwithcurrency').value;
    this.productwithoutcurrency = "";
  }

  Onchangeprodvalue(){
    this.accountform.patchValue({'productwithcurrency': this.prod1valueselect});
  }

  UnsignedValue(data) {
    let a = data;
    this.prod1value = "";
    this.accountform.patchValue({ productwithcurrency: "" });
    this.accountform.patchValue({ productwithoutcurrency: a[0].productId });
    this.productwithoutcurrency = this.accountform.get('productwithoutcurrency').value;
    this.prod1valueselect = null;

  }

}
