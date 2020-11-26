import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-confirm-register",
  templateUrl: "./confirm-register.page.html",
  styleUrls: ["./confirm-register.page.scss"],
})
export class ConfirmRegisterPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  goToHome() {
    window.dataLayer.push({
      event: "trackEvent",
      eventCategory: "becks society",
      eventAction: "thank you",
      eventLabel: "home",
    });
    this.router.navigate(["principal"], {
      queryParamsHandling: "preserve",
    });
  }
}
