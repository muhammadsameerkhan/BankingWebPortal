import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpServiceService } from './http-service.service';

export interface FatcaInterface{
  ProductId : number;
  Res_USResident_Citizen : string;
  Res_USBirthPlace : string;
  Res_US_Res_Add : string;
  Res_US_Tel_Num : string;
  Res_Recv_Funds : string;
  Res_Add_PO_Box : string;
  Res_Attrny_US : string;
  CS_Dec_Form : string;
  W_9_Form : string;
  w_8_BEN_Form : string;
  IsUSPerson : string;
}

@Injectable({
  providedIn: 'root'
})
export class FatcaCrsService {

  public platform : string = "w";
  public SaveFatcaResURL : string = "FatcaCrs/FatcaCrs";

  public testurl : string = 'https://localhost:44351/api/'
  
  constructor(
    private http: HttpServiceService,
    private config: ConfigService,
  ) { }

  public dataobject : FatcaInterface = {
    ProductId : 1,
    CS_Dec_Form : "",
    Res_Add_PO_Box : "",
    Res_Attrny_US : "",
    Res_Recv_Funds : "",
    Res_USBirthPlace : "",
    Res_USResident_Citizen : "",
    Res_US_Res_Add : "",
    Res_US_Tel_Num : "",
    W_9_Form : "",
    w_8_BEN_Form : "",
    IsUSPerson : "",
  }

  public CreatingFatcaCrsResponse (token, object){
    return new Promise ((resolve,reject) =>{
      this.http.postToCloseApi(this.config.server + this.SaveFatcaResURL, object, token).subscribe((data :any )=> {
        if(data?.response?.code == 1){
          resolve(data);
        }
      },
      Error => {
        resolve(Error);
        });
    });
  }
}
