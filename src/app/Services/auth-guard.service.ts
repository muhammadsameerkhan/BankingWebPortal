import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  
  constructor(
    public auth: AuthService, 
    public _router: Router
    ) 
  {}
  
  async canActivate(): Promise<boolean> {

    let a=await this.auth.Get("token");
    debugger;
    if(a){
      return true;
    }else{
      this._router.navigateByUrl("/login");
      return false;
    }
  
  }
}