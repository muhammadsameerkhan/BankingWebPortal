import { CommonService } from './../../Services/common.service';
import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public commonP:CommonService,private _router: Router) { }

  ngOnInit(): void {
    debugger;
   // console.log("URL",this._router.routerState.snapshot.url);
  }
  getLogin(){
  
    // let data= this.commonP.Get('User');
    // if(data){

    //   return true;
      
    // }else{
    //   return false;

    // }
  }

}
