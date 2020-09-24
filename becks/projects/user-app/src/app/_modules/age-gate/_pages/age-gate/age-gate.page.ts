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
    if (
      localStorage.getItem("user-age-gate-local") ||
      sessionStorage.getItem("user-age-gate-session")
    ) {
      this.router.navigate(["home"], { queryParamsHandling: "preserve" });
    }
  }
}
