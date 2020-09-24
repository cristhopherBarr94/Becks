import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../../../../_models/User";

@Component({
  selector: "user-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  public userRegisterForm: FormGroup;
  public userRegister: User = new User();

  constructor() {}

  ngOnInit() {}
}
