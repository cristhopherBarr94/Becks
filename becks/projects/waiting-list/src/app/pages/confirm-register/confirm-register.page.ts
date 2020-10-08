import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-confirm-register",
  templateUrl: "./confirm-register.page.html",
  styleUrls: ["./confirm-register.page.scss"],
})
export class ConfirmRegisterPage implements OnInit {
  constructor() {}

  ngOnInit() {}

  goToFeria() {
    window.dataLayer.push({
      event: "trackEvent",
      eventCategory: "becks society",
      eventAction: "thank you",
      eventLabel: "feria del millon",
    });
    window.open("https://www.feriadelmillon.com.co/becks/");
  }
}
