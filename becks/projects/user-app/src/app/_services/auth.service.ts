import { Injectable } from '@angular/core';


@Injectable()
export class AuthService {
  constructor() {}

  public isAuthenticated(): boolean {
    const token = this.getToken();
    
    // Check whether the token is expired and return
    // true or false
    return typeof(token) == "string" && token.indexOf('Bearer') == 0;
  }

  public setAuthenticated( token: string ) {
    localStorage.setItem("token", token);
  }

  public getToken() {
    return localStorage.getItem('token');
  }
}