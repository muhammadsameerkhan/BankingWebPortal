import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service';
import { ConfigService } from './config.service';


export interface Product {
  id: number;
  companyId: number;
  productId: number;
  acctKey: string;
  acctType: string;
  shortCode: string;
  description: string;
  currencyId: string;
  rounding: number;
  checkBlackList: boolean;
  checkAge: boolean;
  minimumAge: number;
  maximumAge: number;
  checkIdExpiry: boolean;
  checkResident: boolean;
  checkNationality: boolean;
  accountLimit: number;
  debitCard: boolean;
  checkGIDExpiry: boolean;
  dailyLimit: string;
  isTopUp: boolean;
  isDebitCardTopUp: boolean;
  fromOwnAccountTopUp: boolean;
  toOwnTopUp: boolean;
  isTransfer: boolean;
  ownAccountsTransfer: boolean;
  ownAccountsOutwardsTransfer: boolean;
  ownAccountInwardsTransfer: boolean;
  intraBank: boolean;
  intraOutwards: boolean;
  intraInwards: boolean;
  interBank: boolean;
  interOutwards: boolean;
  interInwards: boolean;
  internationalTransfer: boolean;
  intOutWards: boolean;
  intInwards: boolean;
  closure: boolean;
  rate1: number;
  rate2: number;
  isPartial: boolean;
  isTransaction: boolean;
  minimumDeposit?: any;
  editNickName: boolean;
  requestMoney: boolean;
  viaMobileNumber: boolean;
  colorClass?: any;
  isShare: boolean;
  inAppProducts: boolean;
  onBoardingProoduct: boolean;
  isActive: boolean;
  longDescription: string;
  elegibilityText: string;
  subTitle: string;
  descriptionHTML : string;
}

export interface ProductFeature {
  id: number;
  productId: number;
  featureDescription: string;
  isActive: boolean;
  createdDate: Date;
  updateDate?: any;
  createdBy?: any;
  orderNo: number;
  updatedBy?: any;
}

export interface Products {
  product: Product;
  productFeature: ProductFeature[];
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  
  private GetOnboardingProductURL: string = "Product/GetAllOnboardingProduct";
  public SaveOnboardingProductURL: string = "LinkAccount/SaveOnBoardingProduct"
  public GetProductGroupWise: string = "Product/GetProductsGroupWise";

  public sleectedPorduct: Products = { product: undefined, productFeature: [] };

  constructor(private http: HttpServiceService, private ConfigService: ConfigService) { }

  public GetOnBoardingProduct(token) {
    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(this.ConfigService.server + this.GetOnboardingProductURL, {}, token).subscribe((data) => {
        resolve(data);
      }, 
      Error => {
        resolve(Error);
      })
    });
  }

  public SaveOnBoaridngProduct(token, productId) {
    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(this.ConfigService.server + this.SaveOnboardingProductURL, { productId: productId}, token).subscribe((data) => {
        resolve(data);
      }, 
      Error => {
        resolve(Error);
      })
    });
  }

  public GetProductsGroupWise(token, NOA, TOA) : Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(this.ConfigService.server + this.GetProductGroupWise, 
        {NatureOfAccount : NOA, TypesOfAccount : TOA}, token).subscribe((data) => {
        resolve(data);
      }, 
      Error => {
        resolve(Error);
      })
    });
  }
}
