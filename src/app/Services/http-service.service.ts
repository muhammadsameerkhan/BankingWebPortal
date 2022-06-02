import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, DebugElement, TestabilityRegistry } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { timeout } from 'rxjs/operators';
import { ConfigService } from '../Services/config.service';

@Injectable({
  providedIn: 'root'
})

export class HttpServiceService {

  header: any;
  internetMsg = "Internet connection is required,Please check your internet connection!";
  
  testurl :  string = "https://localhost:44351/api/";
  
  constructor(
    public config: ConfigService,
    public http: HttpClient
  ) {
    console.log('Hello HttpServicesProvider Provider');
  }

  getlocationservice():Promise<any>{
    return new Promise((resolve,rejects)=>{
      navigator.geolocation.getCurrentPosition(resp =>{
        resolve({lng: resp.coords.longitude, lat: resp.coords.latitude})
      })
    })
  }
  
  public postToOpenApi(url: string, data: any) {

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    //console.log("Body",JSON.stringify(data));
    return this.http.post(url, JSON.stringify(data), httpOptions).pipe(catchError(this.handleError));
  }

  public postToCloseApi(url: string, data: any, token: string) {

    token = 'Bearer ' + token;
    console.log(token, "token")
    let headers = new HttpHeaders();

    headers = headers.append("Authorization", token);
    headers = headers.append("Content-Type", "application/json");
    console.log(headers, "token")
    console.log("Body", JSON.stringify(data));

    return this.http.post<any>(url, JSON.stringify(data), { headers }).pipe(catchError(this.handleError));
  }

  public posApiDocInstance(url: string, data: any, username, pwd) {

    let httpOptions = {
      headers: new HttpHeaders({
        "Authorization": "Basic " + btoa(username + ":" + pwd),
        'Content-Type': 'application/json',
        "Accept": "application/json"
      })
    };

    return this.http.post(url, data, httpOptions).pipe(catchError(this.handleError));
  };

  public postApiImage(instanceId, accountServerUrl, image, imageSide, username, pwd) {

    let httpOptions = {
      headers: new HttpHeaders({
        "Authorization": "Basic " + btoa(username + ":" + pwd)
      })
    };
    console.log("Kashif");
    console.log(instanceId);
    console.log(accountServerUrl);
    console.log(image);
    //this.http.post(accountServerUrl + "//AssureIDService/Document/" + instanceId + imageSide, image,httpOptions );

    return this.http.post(accountServerUrl + "//AssureIDService/Document/" + instanceId + imageSide, image, httpOptions);
  }

  public getFromOpenApi(url: string, method: string) {

    console.log(url + method);
    let headers = new HttpHeaders();

    headers = headers.append("Content-Type", "application/json");
    console.log(this.config.TimeOut);

    return this.http.get(url  + method, { headers }).pipe(timeout(this.config.TimeOut));
  }

  public getFromCloseApi(url: string, token: string) {

    token = 'Bearer ' + token;
    let headers = new HttpHeaders();

    headers = headers.append("Authorization", token);
    headers = headers.append("Content-Type", "application/json");

    return this.http.get(url, { headers }).pipe(timeout(this.config.TimeOut));
  }

  public getresultFromacuant(instanceId, accountServerUrl, username, pwd) {

    let httpOptions = {
      headers: new HttpHeaders({
        "Authorization": "Basic " + btoa(username + ":" + pwd),
        'Content-Type': 'application/json',
      })
    };

    return this.http.get(accountServerUrl + "AssureIDService/Document/" + instanceId, httpOptions).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {

    console.log("Kashif");
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      console.error("Client Side Error :" + error.error.message);
    } else {
      console.error("Server Side Error :" + error);
    }
    console.error(error);
    return throwError(error);
  }
}