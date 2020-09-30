import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { HttpService } from "src/app/_services/http.service";
import { UiService } from "src/app/_services/ui.service";
import { ProfilePictureComponent } from "../profile-picture/profile-picture.component";
import * as moment from "moment";
import { environment } from "src/environments/environment";

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
  public birthDayDate: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private ui: UiService,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.initforms();
    this.dataProfile = localStorage.getItem("userData");
    this.urlPicture = this.dataProfile.urlPicture;
    this.userEditProfileForm.controls.name.patchValue(
      this.dataProfile.first_name
    );
    this.userEditProfileForm.controls.lastName.patchValue(
      this.dataProfile.last_name
    );
    this.cdr.detectChanges();
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

  saveChanges() {
    if (this.userEditProfileForm.valid) {
      this.ui.showLoading();
      this.birthDayDate = moment()
        .day(this.userEditProfileForm.controls.day.value)
        .month(this.userEditProfileForm.controls.month.value)
        .year(this.userEditProfileForm.controls.year.value)
        .format("DD/MM/YYYY");
      this.httpService
        .patch(environment.serverUrl + environment.user.patchData, {
          first_name: this.userEditProfileForm.controls.name.value,
          last_name: this.userEditProfileForm.controls.lastName.value,
          mobile_phone: this.userEditProfileForm.controls.phone.value,
          birthdate: this.birthDayDate,
        })
        .subscribe((response: any) => {
          console.log(
            "SectionEditProfileComponent -> saveChanges -> response",
            response
          );
          this.ui.dismissLoading();
          if (response.status == 200) {
            // this.closeEdit();
          }
        }),
        (e) => {
          console.log("SectionEditProfileComponent -> saveChanges -> e", e);
          this.ui.dismissLoading();
        };
    }
  }
}
