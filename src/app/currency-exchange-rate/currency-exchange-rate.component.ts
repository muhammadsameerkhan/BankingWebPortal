import { Router } from '@angular/router';
import { CommonService } from './../Services/common.service';
import { AuthService } from './../Services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Guid } from "guid-typescript";

@Component({
  selector: 'app-currency-exchange-rate',
  templateUrl: './currency-exchange-rate.component.html',
  styleUrls: ['./currency-exchange-rate.component.scss']
})
export class CurrencyExchangeRateComponent implements OnInit {

  constructor(public auth: AuthService, private commonP: CommonService,private _router: Router
    ) { }
    LogOut(){
      this.commonP.clearLogout();
      this._router.navigateByUrl('/login');
    }
  ngOnInit(): void {
    this.commonP.presentLoading();

    this.auth.GetExchangeRate(this.auth.accessToken, Guid.create().toString()).then((data: any) => {
      if (data.response) {
        if (data.response.code) {
          if (data.response.code == 1) {
            // this._router.navigateByUrl("/CurrencyExchangeRate");
            this.commonP.hideLoading();


          }
        } else {
          this.commonP.ParseErrorAlert('', '', this._router, data);

        }
      }
      else {
        this.commonP.ParseErrorAlert('', '', this._router, data);

      }


    });
  }

  labelLink(e) {
    e.preventDefault();
    window.open("../assets/Terms-and-Conditions-for-the-use-of-DIB-Visa-Debit-Cards-v1.6.pdf", '_blank');
  }
}
