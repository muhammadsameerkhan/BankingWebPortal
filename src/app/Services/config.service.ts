import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  public language: string = "en";
  constructor() { }

  public TimeOut: number = 2000000;
  public BlinkIDAndroid: string = "";
  public BlinkIDIOS: string = "";
  public OtpResendTime: string = "";
 // public server: string = "https://192.168.1.106:44351/api/";
  public server:string=undefined ;
  //public server:string="http://110.37.211.38:93/api/";
  // public TimeOut:number=15000;
      //public server:string="http://175.107.202.250:93/api/";
      //public server:string="http://40.114.120.180:9901/api/";
  // public server:string="http://175.107.202.250:93/api/";
  //public server:string="http://172.16.19.128:8334/api/";


   // public server:string="http://175.107.202.250:93/api/";
  //public server:string="http://40.114.120.180:9901/api/";

  public backbuttonStateName: string = ""
  public ServerVersion: string = "";
  public dateFormat: string = "DD MMMM YYYY"
  public Morning: string = "";
  public Afternoon: string = "";
  public Evening: string = "";
  public vidoeKey: string = "";
  public videoSecret: string = "";

  GetGreeting() {
    //  debugger;
    let dt = new Date();
    let currentHour: string = dt.getHours().toString();
    currentHour = ("0" + currentHour).slice(-2);
    let currentMinutes: string = dt.getMinutes().toString();
    currentMinutes = ("0" + currentMinutes).slice(-2);

    if (currentHour + ":" + currentMinutes <= this.Morning) {
      return "Good Morning";
    }
    else if (currentHour + ":" + currentMinutes <= this.Afternoon) {
      return "Good Afternoon";
    }
    else if (currentHour + ":" + currentMinutes <= this.Evening) {
      return "Good Evening";
    }
    else {
      return "Good Night";
    }
  }
}
