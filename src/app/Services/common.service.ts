import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as CryptoJS from 'crypto-js';
import { HttpServiceService } from '../Services/http-service.service';
import { HttpClient  } from '@angular/common/http';  

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  alert;
  loading;
  logOutAlert;
  ipAddress: string;
  platform: string = "w";
  longitude: string;
  latitiude: string;

  constructor(
    private auth: AuthService,
    private config: ConfigService,
    private loader: NgxSpinnerService,
    private storagemap: StorageMap,
    public translate: TranslateService,
    public http : HttpServiceService,
    public https : HttpClient
  ) {
    // this.ipAddress = "192.168.0.1";
    // this.GetIpAddress().subscribe((res: any) => {
    // // });

    // })
    // this.networkInterface.getWiFiIPAddress().then((address) => {
    //   this.ipAddress = address.ip;
    // }).catch((error) => {
    //   this.networkInterface.getCarrierIPAddress().then((address) => {
    //     this.ipAddress = address.ip;
    //   }).catch((error) => {
    //   })
    // })
    this.http.getlocationservice().then(resp =>{
      this.longitude = JSON.stringify(resp.lng);
      this.latitiude = JSON.stringify(resp.lat);
    })
  }

  public GetIpAddress() {
    return this.https.get("http://api.ipify.org/?format=json");
  }

  Get(key: string): Promise<any> {

    return new Promise((resolve) => {
      this.storagemap.get(key)
        .subscribe(value => {
        
          if (value) {
            resolve(value);
          }
          else {
            resolve("");
          }
        }, error => {
         
          resolve("");
        })
    })

  }

  Set(key: string, value: string) {
    this.storagemap.set(key, value).subscribe();
  }

  clear() : void {
    this.storagemap.clear().subscribe();
  }

  public DecryptCustome(text) {
   
    var key = CryptoJS.enc.Utf8.parse('8080808080808080');
    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    var decrypted = CryptoJS.AES.decrypt(text, key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    console.log(decrypted.toString(CryptoJS.enc.Utf8));
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  public async presentLoading() {
    //this.loading.present();
    this.loader.show()
    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.loader.hide();
    // }, 5000);
    return;
  }

  public async hideLoading() {
    this.loader.hide();
  }



  public ParseErrorAlert(title, button, _router: Router, httpRes) {

    this.parseError(httpRes).then((mes) => {

      debugger;
      title = title ? title : "Sorry";
      button = button ? button : "OK"
      this.translate.get([title, button]).subscribe(data => {
        debugger;
        console.log(data);
        this.showErrorAlert(data[title], mes, data[button], _router);
      })
    })
  }

  async showErrorAlert(title, message, button, _router: Router) {
    debugger
    let resolveFunction: (confirm: string) => void;
    let promise = new Promise<string>(resolve => {
      resolveFunction = resolve;
    });
    if (this.alert) {
      await this.alert.dismiss();
      //  this.alert = undefined;
    }

    //console.log(this.loading);
    if (this.loading == undefined) {
      await this.hideLoading();
    }

    this.alert = await Swal.fire({
      title: title,
      html: message,
      icon: "error",
      confirmButtonText: button,
      allowOutsideClick: false,
    }).then((result) => {
     // console.log(result);
      if (message == "your session is expired ,please login again (401)") {
        console.log("Kashif");
        this.config.backbuttonStateName = "LetsbeginPage";
        _router.navigate(['login']);
        resolveFunction("Logout");
      }
      // else if(button == "Back"){
      //   _router.navigate(['login']);
      //   this.resolveFunction("Logout");
      // }
      else if (button == "Retry") {
        resolveFunction("Retry");
      }
      else if (button == "Update") {
        resolveFunction(button);
        return false;
      }
      else {
        resolveFunction(button);
      }
    });
    return promise;
  }

  public async showDoLaterAlert(_router: Router) {
   let resolveFunction1: (confirm: string) => void;
  let   promise1 = new Promise<string>(resolve => {
     resolveFunction1 = resolve;
    });
    debugger;
    if (this.logOutAlert) {
      this.logOutAlert.hide();
      //  this.alert = undefined;
    }

    console.log(this.loading);
    if (this.loading == undefined) {
      await this.hideLoading();
      this.loading = null;
    }


    this.translate.get(["Cancel", "Logout", "YourProgressText", "YourProgress"]).subscribe(async data => {

      debugger;
      this.logOutAlert = await Swal.fire({
        title: data["YourProgress"],
        html: data["YourProgressText"],
        icon: "info",
        showCancelButton: data["Cancel"],
        confirmButtonText: data["Logout"],
        allowOutsideClick: false,
      }).then((result) => {
        debugger;
        if (result.isConfirmed) {
         resolveFunction1("Logout");
        }
        else if (result.isDismissed) {
          this.logOutAlert = undefined;
        resolveFunction1("Cancel");
        }
        else {
          resolveFunction1(data["YourProgressText"])
        }
      })
    });
    return promise1;
  }

  public async showLogoutAlert(_router: Router) {
    let resolveFunction: (confirm: string) => void;
    let promise = new Promise<string>(resolve => {
      resolveFunction = resolve;
    });
    debugger;
    if (this.logOutAlert) {
      this.logOutAlert.dismiss();
      //  this.alert = undefined;
    }

    console.log(this.loading);
    if (this.loading != undefined) {
      await this.hideLoading();
      this.loading = null;
    }


    this.translate.get(["Cancel", "Logout", "LogoutMsg", "Info"]).subscribe(async data => {

      debugger;
      this.logOutAlert = await Swal.fire({
        title: data["Info"],
        html: data["LogoutMsg"],
        icon: "info",
        showCancelButton: data["Cancel"],
        confirmButtonText: data["Logout"],
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed){
          debugger
          this.logOutAlert = undefined;
          this.auth.accessToken = "";
          this.clearLogout();
          _router.navigateByUrl("/login");
          resolveFunction(data["Logout"]);
        }
         if (result.isDismissed) {
          this.logOutAlert = undefined;
          resolveFunction("Cancel");
        }
        else {
          resolveFunction(data["LogoutMsg"])
        }
      })
    });
    return promise;
  }

  public clearLogout() {
    this.auth.accessToken = "";
    this.auth.ClearDetail();
  }

  public async showTwoButtonAlert(title, message, buttons: string[], _router: Router) {
    debugger;
    let resolveFunction: (confirm: string) => void;
    let promise = new Promise<string>(resolve => {
      resolveFunction = resolve;
    });
    if (this.alert) {
      this.alert.dismiss();
      //  this.alert = undefined;
    }

    console.log(this.loading);
    if (this.loading == undefined) {
      await this.hideLoading();
      this.loading = null;
    }

    debugger;
    this.alert = await Swal.fire({
      title: title,
      html: message ,
      icon: "icon",
      showDenyButton: true,
      denyButtonText: buttons[0],
      confirmButtonText : buttons[1],
      allowOutsideClick : false,
      }).then((result) =>{
      if(result.isDenied){
        this.alert = undefined;
        resolveFunction(buttons[0]);
      }
      else if(result.isConfirmed){
        resolveFunction(buttons[1]);
      }
      else{
        resolveFunction(message);
      }
    });
    return promise;
  }

  public async showThreeButtonAlert(title, message, buttons: string[], _router: Router) {
    let resolveFunction: (confirm: string) => void;
    let promise = new Promise<string>(resolve => {
      resolveFunction = resolve;
    });
    debugger;
    if (this.alert) {
      this.alert.dismiss();
      //  this.alert = undefined;
    }

    console.log(this.loading);
    if (this.loading != undefined) {
      await this.hideLoading();
      this.loading = null;
    }


    debugger;
    this.alert = await Swal.fire({
      title : title,
      html: message,
      icon: "icon",
      confirmButtonText: buttons,
      allowOutsideClick : false,
    }).then((result) => {
      if(buttons[0]){
        resolveFunction(buttons[0]);
      }
      else if(buttons[1]){
        this.alert = undefined;
        resolveFunction(buttons[1]);
      }
      else if(buttons[2]){
        this.alert = undefined;
        resolveFunction(buttons[2]);
      }
      else{
        resolveFunction(message);
      }
    });
    return promise;
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  async showSuccessAlert(title, message, button, _router: Router) {
    let resolveFunction: (confirm: string) => void;
    let promise = new Promise<string>(resolve => {
      resolveFunction = resolve;
    });
    if (this.alert) {
      await this.alert.dismiss();
      //  this.alert = undefined;
    }

    console.log(this.loading);
    if (this.loading == undefined) {
      await this.hideLoading();
    }

    this.alert = await Swal.fire({
      title: title,
      html: message,
      icon : "success",
      allowOutsideClick : false,
    }).then((result) => {
      console.log(result);
      if (message == "your session is expired ,please login again (401)") {
        console.log("Kashif");
        this.config.backbuttonStateName = "LetsbeginPage";
        _router.navigate(['login']);
        resolveFunction("Logout");
      }
      else if (button == "Retry") {
        resolveFunction("Retry");
      }
      else if (button == "Update") {
        resolveFunction(button);
        return false;
      }
      else {
        resolveFunction(button);
      }
    });
    return promise;
  }

  public parseError(res) {
    return new Promise((resolve, reject) => {

      debugger;
      console.log(res);
      // console.log("Status");
      // console.log(res.status);
      if (res.name) {
        if (res.name == "TimeoutError") {
          this.translate.get(["TimeoutError"]).subscribe(data => {
            console.log("Kashif");
            console.log(data);
            debugger;
            resolve(data["TimeoutError"]);
            //   console.log(data);
            // result = result + data["TimeoutError"] + "<br/>";
          });
        }
      }
      if (res.statusText) {
        if (res.statusText == "Unknown Error") {
          this.translate.get(["00"]).subscribe(data => {
            console.log("Kashif");
            console.log(data);
            debugger;
            resolve(data["00"]);
            //   console.log(data);
            // result = result + data["TimeoutError"] + "<br/>";
          });
        }
      }

      if (typeof (res) == "string") {
        this.translate.get([res]).subscribe(data => {
          resolve(data[res]);
        });
      }

      if (res.status) {

        if (res.status == 500) {

          this.translate.get(["500"]).subscribe(data => {
            resolve(data["500"]);
          });
        }

        if (res.status == 404) {

          this.translate.get(["404"]).subscribe(data => {
            resolve(data["404"]);
          });
        }

        if (res.status == 0) {

          this.translate.get(["00"]).subscribe(data => {
            resolve(data["00"]);
          });
        }

        if (res.status == 401) {
          this.translate.get(["unAuth"]).subscribe(data => {
            resolve(data["unAuth"]);
          });
        }
      }

      //console.log("Error Parsing");
      // console.log(res);
      if (res.error) {
        // console.log(res.res);
        if (res.error.response) {

          if (res.error.response.content?.length > 0) {
            console.log("Test Type OF Error");
            console.log(typeof (res.error.response.content));

            if (Array.isArray(res.error.response.content)) {
              let result = "";
              res.error.response.content.forEach(key => {
                //console.log(key);
                // console.log(res.error.errors[key][0]);
                //   console.log(element);
                this.translate.get([key]).subscribe(data => {
                  //   console.log(data);
                  result = result + data[key] + "<br/>";
                });
              })

              resolve(result);
            }

            else if (res.error.response.message) {
              console.log("hammad erro")
              this.translate.get([res.error.response.message]).subscribe(data => {
                debugger;
                console.log("Translator  Reponse");
                console.log(data);
                console.log(data[res.error.response.message]);

                debugger;
                let a = data[res.error.response.message.toString().trim()];
                resolve(a);
              });
            }
          }

          // console.log(res.error.response);
          this.translate.get([res.error.response.message]).subscribe(data => {
            console.log("Translator  Reponse");
            console.log(data);
            console.log(data[res.error.response.message]);
            debugger;
            let a = data[res.error.response.message.toString().trim()];
            resolve(a);
          });
        }
      }

      else if (res.error?.errors) {
        let result = "";
        Object.keys(res.error.errors).forEach(key => {
          //console.log(key);
          // console.log(res.error.errors[key][0]);
          if (key == "token") {
            // this.registrationP.detail.token = res.error.errors[key][0];
          }
          else {
            res.error.errors[key].forEach(element => {
              //   console.log(element);
              this.translate.get([element]).subscribe(data => {
                debugger;
                //   console.log(data);
                result = result + data[element] + "<br/>";
              });
            });
          }
        })
        resolve(result);
      }
      else if (res.response?.code) {
        this.translate.get([res.response?.message]).subscribe(data => {
          debugger;
          console.log("Translator  Reponse");
          console.log(data);
          console.log(data[res.response?.message]);

          debugger;
          let a = data[res.response?.message.toString().trim()];
          resolve(a);
        });
      }
      else {
      }
    })
  }
}