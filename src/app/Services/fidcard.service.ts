import { Country } from './countries.service';
import { ConfigService } from './config.service';
import { HttpServiceService } from './http-service.service';
import { Injectable } from '@angular/core';
import { resolve } from 'dns';
import { rejects } from 'assert';

export interface Fid {

  firstName: string;
  middleName: string;
  familyName: string;
  countryID: string;
  dOB: string;
  gender: string;
  nationality: string;
  dOE: string;
  documentCode: string;
  documentNumber: string;
  issuer: string;
  optionalData1: string;
  optionalData2: string;
  mrtzdraw: string;
  frontCardImage: string;
  backCardImage: string;
  personFaceImage: string;
  type:string;
  fullName: string;
}

export interface Foreignbank{

  AccountTitleName : string;
  IBAN : string;
  BankName : string;
  Country : string;

}

@Injectable({
  providedIn: 'root'
})

export class FIDCardService {

  public platform: string = "w";
  private FIDSAVEURL: string = this.config.server + "ForiegnId/set";
  private ForeignbankURL : string = this.config.server + "ForiegnId/Foreignbankdetails";
  
  public FId: Fid = {

    type:"",
    backCardImage: "", 
    familyName: "", 
    firstName: "", 
    frontCardImage: "", 
    fullName: "", 
    dOB: "", 
    dOE: "", 
    documentCode: "", 
    documentNumber: "", 
    issuer: "", 
    optionalData1: "", 
    optionalData2: "", 
    middleName: "", 
    mrtzdraw: "", 
    nationality: "", 
    countryID: "", 
    personFaceImage: "", 
    gender: "", 
  };

  public foreignobject : Foreignbank = {
    AccountTitleName: "",
    BankName: "",
    Country: "",
    IBAN: "",
  }

  constructor(
    private http: HttpServiceService, 
    private config: ConfigService
    ) {
  }

  public Save(token) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(this.FIDSAVEURL, this.FId, token).subscribe((data) => {
        resolve(data);
      }, 
      Error => {
        resolve(Error);
      })
    });
  }

  public PostForeignDetails(token, object){
    return new Promise((resolve, reject)=> {
      this.http.postToCloseApi(this.ForeignbankURL, object ,token).subscribe((data)=>{
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              resolve(data);
            }
          }
        }
      },
      Error => {
        resolve(Error);
      })
    })
  }
}

