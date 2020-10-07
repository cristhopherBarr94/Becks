import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-confirm-register",
  templateUrl: "./confirm-register.page.html",
  styleUrls: ["./confirm-register.page.scss"],
})
export class ConfirmRegisterPage implements OnInit {
  private wasClicked = false;
  constructor() {}

  ngOnInit() {}

  goToFeria() {
    if (!this.wasClicked) {
      this.wasClicked = true;
      window.dataLayer.push({
        event: "trackEvent",
        eventCategory: "becks society",
        eventAction: "thank you",
        eventLabel: "feria del millon",
      });
    }
  }
}
