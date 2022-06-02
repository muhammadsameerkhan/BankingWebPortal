import { HttpServiceService } from './http-service.service';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { data } from 'jquery';

export interface PassIntPortObject {
	FullName:string;
  FirstName:string;
  MiddleName:string;
	FamilyName:string;
	CountryId:string;
  DOB: string;
	Gender:string;
	Nationality:string;
  DOE: string;
  DocumentCode: string;
  DocumentNumber:string;
  OptionalData1:string;
  OptionalData2:string;
  MrtDraw:string;
  Issuer:string;
  FrontCardImage:string;
  type:string;
  DeviceID:string;
  OtherNationlity : string;
  }

@Injectable({
  providedIn: 'root'
})

export class PassportService {

  public passportObject : PassIntPortObject = {
    type : "",
    Gender : "",
    OptionalData1 : "",
    OptionalData2 : "",
    FamilyName : "",
    FirstName : "",
    FullName : "",
    FrontCardImage : "",
    DOB : "",
    DOE : "",
    DeviceID : "",
    DocumentCode : "",
    DocumentNumber : "",
    MiddleName : "",
    MrtDraw : "",
    Nationality : "",
    Issuer : "",
    CountryId : "",
    OtherNationlity : ''
  };

  private PassportSaveURL : string = "passport/set";
  private GetdetailsURL : string = "passport/GetPassportdetails";

  
  constructor(
    private config:ConfigService,
    private http:HttpServiceService
    ) {}
  
  public Clear(){
    this.passportObject = {
      type : "",
      Gender : "", 
      OptionalData1 : "",
      OptionalData2 : "",
      FamilyName : "",
      FirstName : "",
      FullName : "",
      FrontCardImage : "",
      DOB : "",
      DOE : "",
      DeviceID : "",
      DocumentCode : "",
      DocumentNumber : "",
      MiddleName : "",
      MrtDraw : "",
      Nationality : "",
      Issuer : "",
      CountryId : "",
      OtherNationlity : ''
    };
  }

  public Set(token){
    return new Promise((resolve,reject)=>{
      this.http.postToCloseApi(this.config.server + this.PassportSaveURL ,this.passportObject,token).subscribe((data)=>{
      resolve(data);
      },
      Error=>{
        resolve(Error);
      })
    });
  }

  public GetPassDetails(token){
    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(this.config.server + this.PassportSaveURL, {}, token).subscribe((data)=>{
        resolve(data);
      },
      Error => {
        resolve(Error);
      })
    })
  }
}
