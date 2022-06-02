import { CommonService } from './../Services/common.service';
import { AuthService } from './../Services/auth.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { HttpServiceService } from '../Services/http-service.service';
import { Md5 } from 'ts-md5/dist/md5'
import * as shajs from 'sha.js'; 
import { sha256 } from 'js-sha256';

@Injectable({
  providedIn: 'root'
})

export class BaseClassService implements HttpInterceptor {

  platform: string = "w";
  longitude;
  latitiude

  private _jsonURL = 'assets/APIURL.json';
  
  constructor(
    private injector: Injector,
    private auth: AuthService,
    private commonService: CommonService,
    private http : HttpServiceService
  ) {
    this.getlocationservice().then(resp =>{
      this.longitude = JSON.stringify(resp.lng);
      this.latitiude = JSON.stringify(resp.lat);
      console.log(resp);
    })
  }

  getlocationservice():Promise<any>{
    return new Promise((resolve,rejects)=>{
      debugger
      navigator.geolocation.getCurrentPosition(resp =>{
        resolve({lng: resp.coords.longitude, lat: resp.coords.latitude})
        
      })
    })
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(req);
    let http: HttpClient = this.injector.get(HttpClient);
   
if(req.url.includes("undefined")){
  return http.get(this._jsonURL).pipe(switchMap((response:any)=>{
debugger;
    let a=req.url;
    a=a.replace("undefined",response.URL);
    const newUrl = {url: a};
    const urlWithParams={urlWithParams:a}
    req = Object.assign(req, newUrl);
    req = Object.assign(req, urlWithParams);
    if (req.method == "POST") {
      const md5 = new Md5();
      //debugger;
      let a = req.body;
      console.log("Before base class", a)
      let b = JSON.parse(a);
      b.BaseClass = {
        "IP": "192.168.0.1", 
        "DeviceID": "string",
        "ChannelType": "Web", 
        "Latitude": '24.9815886',
        "Longitude": '67.0632167', 
        "Platform": "w", 
        "Browser" : '',
        "MobileModel": "s", 
        "AppVersion": "s", 
      };
      // var tobehash = JSON.stringify(b);

      // var hash = sha256.create();
      // hash.update(tobehash);
      // hash.hex();
      // debugger;
      // b.GeneratedHash = sha256(tobehash);

      // b.GeneratedHash = shajs('sha256').update(tobehash).digest('hex');

      // var hashedvalue = md5.appendStr(tobehash).end();debugger
      // b.GeneratedHash = hashedvalue;
      //debugger;
      const bod = { body: JSON.stringify(b) };
      req = Object.assign(req, bod);


      console.log("After base class", req.body)
      debugger;
      return next.handle(req).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            debugger;
            console.log('event--->>>', event);
            if (event.body?.response?.token) {
              debugger
              this.auth.accessToken = event.body?.response?.token;
              this.commonService.Set('token', this.auth.accessToken);
            }
          }
          return event;
        }));;


    }
    else {
      debugger;
      return next.handle(req).pipe(
        map((event: HttpEvent<any>) => {
          debugger;
          if (event instanceof HttpResponse) {
            console.log('event-adas-->>>', event);
            if (event.body?.response?.token) {
            }
          }
          return event;
        }));;

    }
    
    //return next.handle(req);

  }))
}
return next.handle(req);  



    
  }


  //   public   getJSON() {
  //     return  this.http.get(this._jsonURL);
  //   }
}