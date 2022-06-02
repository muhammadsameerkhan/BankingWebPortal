import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { CommonService } from './Services/common.service'
import { ConfigService } from './Services/config.service';
import { AuthService } from './Services/auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Dubai Islamic Bank';

  constructor(
    private translate: TranslateService,
    private commonP : CommonService,
    private config : ConfigService,
    private auth : AuthService,
    private _router : Router
    ) {
    translate.setDefaultLang('en');
    translate.use('en');

    this.getversion();
  }

  getversion(){
  this.commonP.presentLoading();
   this.auth.GetVersion().then((res: any) => {
    debugger;
    if (res.response) {
      if (res.response.code) {
        if (res.response.code == 1) {
          this.commonP.hideLoading();
          console.log(JSON.parse(this.commonP.DecryptCustome(res.response.content)));
          /// console.log(data);

          let checkVersionData: any = JSON.parse(this.commonP.DecryptCustome(res.response.content));
          this.config.TimeOut = checkVersionData.dynamicObject.TimeOut;
          this.config.ServerVersion = checkVersionData.version;
          this.config.BlinkIDAndroid = checkVersionData.dynamicObject.BlinkIDAndroid;
          this.config.BlinkIDIOS = checkVersionData.dynamicObject.BlinkIDIOS;
          this.config.OtpResendTime = checkVersionData.dynamicObject.OtpResendTime;
          this.config.Morning = checkVersionData.dynamicObject.Morning;
          this.config.Evening = checkVersionData.dynamicObject.Evening;
          this.config.Afternoon = checkVersionData.dynamicObject.Afternoon;
          this.config.videoSecret = checkVersionData.dynamicObject.VideoSecret;
          this.config.vidoeKey = checkVersionData.dynamicObject.VideoKey;

          
        } else {
          this.commonP.hideLoading();
          this.commonP.ParseErrorAlert('', '', this._router, res);
        }
      } else {
        this.commonP.hideLoading();
        this.commonP.ParseErrorAlert('', '', this._router, res);
      }
    } else {
      this.commonP.hideLoading();
      if (res.name) {
        if (res.name == "TimeoutError") {
          debugger;
          this.translate.get(["Wewillbe", "WeRegrettheinconvenience", "Retry"]).subscribe(data => {
            debugger;
            this.commonP.showErrorAlert(data.Wewillbe, data.WeRegrettheinconvenience, data.Retry, this._router).then((data: any) => {
              this.commonP.presentLoading();
              window.location.reload();
            })
          })
        } else {
          this.commonP.ParseErrorAlert('', '', this._router, res);
        }
      } else {
        this.commonP.ParseErrorAlert('', '', this._router, res);
      }
    }
  })
  }
}
