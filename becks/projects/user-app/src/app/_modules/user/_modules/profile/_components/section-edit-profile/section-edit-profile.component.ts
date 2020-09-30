import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ProfilePictureComponent } from "../profile-picture/profile-picture.component";

@Component({
  selector: "user-section-edit-profile",
  templateUrl: "./section-edit-profile.component.html",
  styleUrls: ["./section-edit-profile.component.scss"],
})
export class SectionEditProfileComponent implements OnInit, AfterViewInit {
  @ViewChild(ProfilePictureComponent) picture: ProfilePictureComponent;
  public userEditProfileForm: FormGroup;
  public dataProfile: any;
  public urlPicture: string;

  constructor(private router: Router, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initforms();
    this.dataProfile = localStorage.getItem("userData");
    this.urlPicture = this.dataProfile.urlPicture;
    console.log(
      "SectionEditProfileComponent -> ngOnInit -> this.dataProfile",
      this.dataProfile
    );
  }

  ngAfterViewInit() {
    this.picture.urlImage = this.urlPicture;
  }

  initforms() {
    this.userEditProfileForm = this.formBuilder.group({
      name: new FormControl("", [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
      phone: new FormControl("", [
        Validators.required,
        Validators.minLength(10),
      ]),
      day: new FormControl("", [
        Validators.required,
        Validators.min(1),
        Validators.max(31),
      ]),
      month: new FormControl("", [
        Validators.required,
        Validators.min(1),
        Validators.max(12),
      ]),
      year: new FormControl("", [
        Validators.required,
        Validators.min(1920),
        Validators.max(2020),
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

  closeEdit() {
    this.router.navigate(["user/profile"], {
      queryParamsHandling: "preserve",
    });
  }

  public getMessageform(
    item: any,
    name: string,
    minlength?: number,
    min?: number,
    max?: number
  ): string {
    if (item.hasError("required")) {
      return "Ingrese un " + name;
    } else if (item.hasError("minlength")) {
      return "Ingrese un " + name + " de mínimo " + minlength + " caracteres";
    } else if (item.hasError("pattern")) {
      return "Ingrese solo letras";
    } else if (item.hasError("min") || item.hasError("max")) {
      return "Ingrese un valor entre " + min + " y " + max;
    }
  }
}
