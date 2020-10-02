import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { UiService } from "src/app/_services/ui.service";
import { User } from "../../../../_models/User";

@Component({
  selector: "user-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  public userRegisterForm: FormGroup;
  public userRegister: User = new User();
  public userLoginForm: FormGroup;

  constructor(private ui: UiService) {}

  ngOnInit() {
    this.ui.dismissLoading();
  }
}
