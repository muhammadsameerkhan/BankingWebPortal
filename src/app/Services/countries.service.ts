import { ConfigService } from './config.service';
import { HttpServiceService } from './http-service.service';
import { Injectable, OnDestroy } from '@angular/core';
import { DefaultValueAccessor } from '@angular/forms';

export interface Country {

  createdDate: Date;
  crossAllowed: boolean;
  flagClass: string;
  foriegnIssuerAllowed: boolean;
  foriegnNationalityAllowed: boolean;
  idLength: number;
  isActive: boolean;
  isBlink: boolean;
  isColorTest: boolean;
  isFeatured: boolean;
  isMobile: boolean;
  isStayAllowed: boolean;
  featureOrder: number;
  isoCode: string;
  isoCode3: string;
  mobileCode: string;
  countryName: string;
  nationality: string;
  mobileLength: number;
  mask: string;
  primaryIssuerAllowed: boolean;
  primaryNationalityAllowed: boolean;
  twoParts: boolean;
  mobileOperators: MobileOperator[];
  mobileMaxLength : number;
}

export interface CountriesModel {
  countryName : string;
  isoCode3 : string;
  states : StatesModel[];
}

export interface CountriesCitiesModel {
  countryName : string;
  isoCode3 : string;
  cities : CitiesModel[];
}

export interface StatesModel {
  stateId : number;
  stateName : string;
  cities : CitiesModel[];
}

export interface CitiesModel{
  cityName : string;
  cityId : number;
}

export interface CityListModel {
  cityName : string;
  cityId : number;
  branches : BranchModel[];
}

export interface BranchModel {
  id : number;
  branchName : string;
  city : string;
  isActive : boolean;
  createdDate : string;
  deactivated : string;
}


export interface MobileOperator {

  code: string;
  isoCode3: string;
  createdDate: Date;
}
export interface City {

  id: number;
  city: string;
  countryCode: string;
  isActive: boolean;
}


@Injectable({
  providedIn: 'root'
})

export class CountriesService {

  private GetAllCounties: string = "Country/GetAll";
  private GetCity: string = "Country/GetCity";
  private GetBranchURL : string = "Country/GetBranches"
  public countries: Country[] = [];

  constructor(
    private http: HttpServiceService,
    private ConfigService: ConfigService
  ) { }

  public GetAllCity(token, isoCode) {

    return new Promise((resolve, reject) => {
      this.http.postToCloseApi(this.ConfigService.server + this.GetCity,
        { isoCode3: isoCode }, token).subscribe((data) => {
          resolve(data);
        },
          Error => {
            resolve(Error);
          })
    });
  }

  public GetAll(UniqueId) {

    return new Promise((resolve, reject) => {
      this.http.postToOpenApi(this.ConfigService.server + this.GetAllCounties, {UniqueId : UniqueId}).subscribe((data) => {
        resolve(data);
      },
        Error => {
          resolve(Error);
        })
    });
  }

  public GetBranches(data){
    return new Promise((resolve, reject) => {
      this.http.postToOpenApi(this.ConfigService.server + this.GetBranchURL, {UniqueId : data}).subscribe((data) => {
        resolve(data);
      },
      Error => {
        resolve(Error);
      })
    })
  }

  public GetCountryObject() {
    let selectedCountry: Country = {
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
    };
    return selectedCountry;
  }

}
