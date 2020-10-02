import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";

@Injectable()
export class AgeGuardService implements CanActivate {
  constructor(public router: Router) {}
  canActivate(): boolean {
    if (
      !localStorage.getItem('"user-age-gate-local') &&
      !sessionStorage.getItem("user-age-gate-session")
    ) {
      this.router.navigate(["age-gate"]);
      return false;
    }
    return true;
  }
}
