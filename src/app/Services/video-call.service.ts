import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class VideoCallService {

  public RequestCallURl:string="Video/RequestCall";

  constructor(private http:HttpServiceService,private ConfigService:ConfigService) { }


public RequestCall(token,gender){
  return new Promise((resolve,reject)=>{
  
    this.http.postToCloseApi(this.ConfigService.server+this.RequestCallURl,{Gender:gender},token).subscribe((data)=>{

resolve(data);

    },Error=>{
      resolve(Error);
    
    })
  });

}


}
