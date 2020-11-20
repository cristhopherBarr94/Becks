import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthService } from './auth.service';

@Injectable()
export class AgeGuardService implements CanActivate {
  constructor(private router: Router,
              private auth: AuthService) {}
  canActivate(): boolean {
    if ( this.auth.isAuthenticated() ) {
      this.router.navigate(["user/exp"]);
      return true;
    }
    if ( !localStorage.getItem('"user-age-gate-local') &&
        !sessionStorage.getItem("user-age-gate-session") ) {
      this.router.navigate(["age-gate"]);
      return false;
    }
    return true;
  }
}
