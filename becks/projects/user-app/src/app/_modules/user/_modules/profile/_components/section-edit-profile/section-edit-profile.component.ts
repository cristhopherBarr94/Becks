import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { HttpService } from "src/app/_services/http.service";
import { UiService } from "src/app/_services/ui.service";
import * as moment from "moment";
import { environment } from "src/environments/environment";
import { Subscription } from "rxjs";
import { UserService } from "src/app/_services/user.service";
import { User } from "src/app/_models/User";
import { NameTittleComponent } from "../name-tittle/name-tittle.component";

@Component({
  selector: "user-section-edit-profile",
  templateUrl: "./section-edit-profile.component.html",
  styleUrls: ["./section-edit-profile.component.scss"],
})
export class SectionEditProfileComponent implements OnInit {
  public user = new User();
  public userEditProfileForm: FormGroup;
  public urlPicture: string;
  public birthDayDate: any;
  public chargePhoto: boolean = false;
  userSubscription: Subscription;

  constructor(
    private userSvc: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private ui: UiService,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    if (this.userSvc.getActualUser()) {
      this.user = this.userSvc.getActualUser();
    } else {
      this.userSvc.getData();
    }
    this.initforms();
    this.cdr.detectChanges();
  }

  initforms() {
    this.userEditProfileForm = this.formBuilder.group({
      name: new FormControl(this.user.first_name, [
        Validators.required,
        Validators.minLength(3),
      ]),
      lastName: new FormControl(this.user.last_name, [
        Validators.required,
        Validators.minLength(3),
      ]),
      phone: new FormControl(this.user.mobile_phone, [
        Validators.required,
        Validators.minLength(10),
      ]),
      day: new FormControl(
        !!this.user.birthdate && moment(this.user.birthdate).format("DD"),
        [Validators.required, Validators.min(1), Validators.max(31)]
      ),
      month: new FormControl(
        !!this.user.birthdate && moment(this.user.birthdate).format("MM"),
        [Validators.required, Validators.min(1), Validators.max(12)]
      ),
      year: new FormControl(
        !!this.user.birthdate && moment(this.user.birthdate).format("YYYY"),
        [Validators.required, Validators.min(1920), Validators.max(2020)]
      ),
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
    this.chargePhoto = false;
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
      this.birthDayDate =
        this.userEditProfileForm.controls.month.value +
        "/" +
        this.userEditProfileForm.controls.day.value +
        "/" +
        this.userEditProfileForm.controls.year.value;

      this.httpService
        .patch(environment.serverUrl + environment.user.patchData, {
          first_name: this.userEditProfileForm.controls.name.value,
          last_name: this.userEditProfileForm.controls.lastName.value,
          mobile_phone: this.userEditProfileForm.controls.phone.value,
          birthdate: this.birthDayDate,
        })
        .subscribe((response: any) => {
          if (response.status == 200) {
            this.userSvc.getData();
            this.closeEdit();
            this.ui.dismissLoading();
          }
        }),
        (e) => {
          console.log("SectionEditProfileComponent -> saveChanges -> e", e);
          this.ui.dismissLoading();
        };
    }
  }

  profilePicture() {
    return !!this.user.photo
      ? this.user.photo
      : this.user.gender == "female"
      ? "../../../../../../../assets/img/profile_female.jpg"
      : "../../../../../../../assets/img/profile_male.jpg";
  }

  changePhoto() {
    this.chargePhoto = !this.chargePhoto;
    this.ui.showModal(NameTittleComponent, "", true, true);
  }
}
