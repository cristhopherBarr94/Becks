import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-age-gate-page",
  templateUrl: "./age-gate.page.html",
  styleUrls: ["./age-gate.page.scss"],
})
export class AgeGatePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    if (this.readCookie("user_register_wl") == "0") {
      this.router.navigate(["confirm-register"], {
        queryParamsHandling: "preserve",
      });
    }

    if (
      localStorage.getItem("age-gate-local") ||
      sessionStorage.getItem("age-gate-session")
    ) {
      this.router.navigate(["principal"], { queryParamsHandling: "preserve" });
    }
  }

  private readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}
