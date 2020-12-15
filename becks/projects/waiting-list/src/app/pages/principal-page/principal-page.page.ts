import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../../model/User";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-principal-page",
  templateUrl: "./principal-page.page.html",
  styleUrls: ["./principal-page.page.scss"],
})
export class PrincipalPagePage implements OnInit {
  public userRegisterForm: FormGroup;

  public userRegister: User = new User();
  @ViewChild("principalContent") principalContent;

  constructor(public userService: UserService, private router: Router) {}

  ngOnInit() {
    if (this.readCookie("user_register_wl") == "0") {
      this.router.navigate(["confirm-register"], {
        queryParamsHandling: "preserve",
      });
    }

    if (!localStorage.getItem("age-gate-local")) {
      if (!sessionStorage.getItem("age-gate-session")) {
        this.router.navigate(["age-gate"], { queryParamsHandling: "preserve" });
      }
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
