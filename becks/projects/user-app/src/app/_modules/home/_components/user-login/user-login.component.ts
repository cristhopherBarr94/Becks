import { Component, OnInit, Input } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";

@Component({
  selector: "user-user-login",
  templateUrl: "./user-login.component.html",
  styleUrls: ["./user-login.component.scss"],
})
export class UserLoginComponent implements OnInit {
  public userLoginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initforms();
  }

  initforms() {
    this.userLoginForm = this.formBuilder.group({
      email: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.maxLength(30),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  public getClassInput(item: any): string {
    let classreturn = "input-becks";
    if (item.valid) {
      classreturn = "input-becks-ok";
    } else if (item.touched) {
      classreturn = "input-becks-error";
    }
    return classreturn;
  }

  public getMessageform(
    item: any,
    name: string,
    min?: number,
    max?: number
  ): string {
    if (item.hasError("email") && name === "email") {
      return "Ingrese una dirección de correo electrónico válida";
    }
    if (item.hasError("password")) {
      return "Contraseña inválida";
    }
  }
}
