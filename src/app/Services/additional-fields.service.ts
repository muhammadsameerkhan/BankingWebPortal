import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpServiceService } from './http-service.service';

export interface AdditionalFieldsModel{

  ProductId : number;
  AccountId : number;
  AddressType : number;
  ResidenceAddressLine1 : string;
  ResidenceAddressLine2 : string;
  PurposeOfAccount : string;
  Pep : boolean;
  PepRelation : boolean;
  MonthlyIncome : string;
  Occupation : string;
  CompanyName : string;
  CountryOfBirth : string;
  CountryOfResidence : string;
  CityOfResidence : string;
  FrequencyStatements : string;
  MonthExpctCrditTrans : string;
  ExpctMonthCrditTrnovr : string;
  MotherMaidenName : string;
  MailingAddressLine1 : string;
  MailingAddressLine2 : string;
  CityOfBirth : string;
  StateOfResidence : string;
  PostCodeResidence : string;
  CountryOfMailAdd : string;
  StateOfMailAdd : string;
  CityOfMailAdd : string;
  PostCodeOfMailAdd : string;
  Remittance : string;
  formid : string;
}

export interface AdditionalDocConfigModel {
  id : number;
  CompanyId : number;
  ProductId : number;
  Type : string;
  DocId : number;
  LabelEn : string;
  LabelAr : string;
  Description : string;
  DocumentType : string;
  OrderNo : string;
}

export interface HashModel{
  IncomingObject : any,
  GeneratedHash : string;
}

export interface AdditionalDocs{
  docId : number;
  documentType : string;
  image : string;
  // listofadddoc : listofadddocModel[];
}

export interface listofadddocModel{
  companyId : number;
  description : string;
  docId : string;
  documentType : string;
  id : number;
  isActive : number;
  isWebOnly : boolean;
  labelAr : string;
  labelEn : string;
  mobileDescription : string;
  orderNo : number;
  productId : number;
  type : string;
  updatedDate : string;
}

@Injectable({
  providedIn: 'root'
})

export class AdditionalFieldsService {

  public Platform : string = "w";
  public SaveAdditionalResFldsURL : string = "AddFldResp/SaveAdditionalFields";
  public GetAddDocURL : string = "AdditionalDocs/GetAddDocConfig"
  public SaveDocs : string = "AdditionalDocs/SaveAdditionalDocs"
  
  public testurl: string = "https://localhost:44351/api/"

  public data: AdditionalFieldsModel = {
    ProductId: 1,
    AccountId: 1,
    AddressType: 1,
    CityOfBirth : '',
    CityOfMailAdd : '',
    CityOfResidence : '',
    CountryOfBirth : '',
    CountryOfMailAdd : '',
    CountryOfResidence : '',
    FrequencyStatements : '',
    MailingAddressLine1 : '',
    MailingAddressLine2 : '',
    Pep : false,
    PepRelation : false,
    PostCodeOfMailAdd : '',
    PostCodeResidence : '',
    PurposeOfAccount : '',
    Remittance : '',
    ResidenceAddressLine1 : '',
    ResidenceAddressLine2 : '',
    StateOfMailAdd : '',
    StateOfResidence : '',
    MotherMaidenName: "",
    Occupation: "",
    CompanyName: "",
    MonthlyIncome: "",
    MonthExpctCrditTrans: "",
    ExpctMonthCrditTrnovr: "",
    formid : "",
  };

  public DocsObject : AdditionalDocs = {
    docId : 0,
    documentType : '',
    image : '',
    // listofadddoc : []
  }

  constructor(
    private http: HttpServiceService,
    private config: ConfigService,
  ) { }

  public SaveAdditionalFields(token, object) {
    debugger
    // let a:Data={hash:"asdad",myData:object}; assigning objectdata to interface field and hash to another
    return new Promise((resolve, reject) => {
      this.http.postToCloseApi( this.config.server + this.SaveAdditionalResFldsURL , object, token).subscribe((data: any) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              resolve(data);
              //this.data = data.response.content;
            }
          }
        }
      },
        Error => {
          resolve(Error);
        })
    });
  }

  public GetAddDocConfig(token) : Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(this.config.server + this.GetAddDocURL, {IsWeb: true}, token).subscribe((data) => {
        resolve(data);
      }, 
      Error => {
        resolve(Error);
      })
    });
  }

  public SaveAdditionalDocs(token, object){
    debugger
    return new Promise((resolve, reject) => {
      this.http.postToCloseApi( this.config.server + this.SaveDocs, object, token).subscribe((data: any) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              resolve(data);
              //this.data = data.response.content;
            }
          }
        }
      },
        Error => {
          resolve(Error);
        })
    });
  }
}
