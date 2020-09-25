import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "src/app/_services/http.service";
import { UiService } from "src/app/_services/ui.service";

@Component({
  selector: "user-section-request-confirm",
  templateUrl: "./section-request-confirm.component.html",
  styleUrls: ["./section-request-confirm.component.scss"],
})
export class SectionRequestConfirmComponent implements OnInit {
  constructor(
    public httpService: HttpService,
    private router: Router,
    private ui: UiService
  ) {}

  ngOnInit() {}
  back() {
    this.router.navigate(["recovery"]);
  }
}
