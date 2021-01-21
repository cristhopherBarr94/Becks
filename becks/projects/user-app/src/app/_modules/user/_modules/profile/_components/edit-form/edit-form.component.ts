import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { Subscription } from "rxjs";
import { User } from "src/app/_models/User";
import { HttpService } from "src/app/_services/http.service";
import { UiService } from "src/app/_services/ui.service";
import { UserService } from "src/app/_services/user.service";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MockCiudades } from "../../../../../../_mocks/ciudades-mock";

@Component({
  selector: "user-edit-form",
  templateUrl: "./edit-form.component.html",
  styleUrls: ["./edit-form.component.scss"],
})
export class EditFormComponent implements OnInit, OnDestroy {
  @Input() set save(res: boolean) {
    if (res) {
      this.saveChanges();
    }
  }
  public user = new User();
  public userEditProfileForm: FormGroup;
  public birthDayDate: any;
  public size: string;
  public httpError: string;
  userSubscription: Subscription;
  options: string[] = MockCiudades;
  filteredCityOptions: Observable<string[]>;

  constructor(
    private userSvc: UserService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private ui: UiService,
    private httpService: HttpService,
    private platform: Platform,
    private router: Router
  ) {
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
    });
  }

  ngOnInit() {
    this.userSubscription = this.userSvc.user$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
    if (this.userSvc.getActualUser()) {
      this.user = this.userSvc.getActualUser();
    } else {
      this.userSvc.getData();
    }
    this.initforms();
    this.cdr.detectChanges();
    this.filteredCityOptions = this.userEditProfileForm.controls.city.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  initforms() {
    this.userEditProfileForm = this.formBuilder.group({
      fullname: new FormControl(this.user.full_name, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
      ]),
      phone: new FormControl(this.user.mobile_phone, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
      ]),
      id: new FormControl(this.user.type_id, [Validators.required]),
      document: new FormControl(this.user.id_number, [Validators.required]),
      city: new FormControl(this.user.city, Validators.required),
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

  public getClassInputSelect(item: any): string {
    let classreturn = "select-becks";
    if (item.valid) {
      classreturn = "select-becks-ok";
    } else if (item.touched) {
      classreturn = "select-becks-error";
    }
    return classreturn;
  }

  public getMessageform(
    item: any,
    name: string,
    minlength?: number,
    maxlength?: number,
    min?: number,
    max?: number
  ): string {
    if (item.hasError("required")) {
      return "Ingrese un " + name;
    } else if (item.hasError("minlength")) {
      return "Ingrese un " + name + " de mínimo " + minlength + " caracteres";
    } else if (item.hasError("maxLength")) {
      return "Ingrese un " + name + " de maximo " + maxlength + " caracteres";
    } else if (item.hasError("pattern")) {
      return "Ingrese solo letras";
    } else if (item.hasError("min") || item.hasError("max")) {
      return "Valor entre " + min + " y " + max;
    }
  }

  public saveChanges() {
    if (this.userEditProfileForm.invalid) {
      (<any>Object)
        .values(this.userEditProfileForm.controls)
        .forEach((control) => {
          control.markAsTouched();
        });
      return;
    } else {
      const isValidForm = this.userEditProfileForm.valid;
      if (this.size != "xs") {
        //DESKTOP
        if (isValidForm) {
          this.ui.showLoading();
          // this.birthDayDate = !!this.userEditProfileForm.controls.day.value
          //   ? this.userEditProfileForm.controls.month.value.toString().trim() +
          //     "/" +
          //     this.userEditProfileForm.controls.day.value.toString().trim() +
          //     "/" +
          //     this.userEditProfileForm.controls.year.value.toString().trim()
          //   : undefined;

          this.httpService
            .patch(environment.serverUrl + environment.user.patchData, {
              full_name: this.userEditProfileForm.controls.fullname.value.trim(),
              mobile_phone: this.userEditProfileForm.controls.phone.value.trim(),
              // birthdate: this.birthDayDate,
              type_id: this.userEditProfileForm.controls.id.value.trim(),
              id_number: this.userEditProfileForm.controls.document.value.trim(),
              city: this.userEditProfileForm.controls.city.value.trim(),
            })
            .subscribe(
              (response: any) => {
                this.ui.dismissLoading();
                if (response.status == 200) {
                  this.userSvc.getData();
                  this.goToProfile();
                } else {
                  this.httpError = "Campos del formulario invalidos";
                }
              },
              (e) => {
                this.httpError = "Campos del formulario invalidos";
                this.ui.dismissLoading();
              }
            );
        } else {
          this.httpError = "Campos del formulario invalidos";
        }
      } else {
        //MOBILE

        if (
          !this.userEditProfileForm.controls.fullname.invalid &&
          !this.userEditProfileForm.controls.phone.invalid &&
          !this.userEditProfileForm.controls.city.invalid
          // !this.userEditProfileForm.controls.month.invalid &&
          // !this.userEditProfileForm.controls.day.invalid &&
          // !this.userEditProfileForm.controls.year.invalid
        ) {
          this.ui.showLoading();
          // this.birthDayDate = !!this.userEditProfileForm.controls.day.value
          //   ? this.userEditProfileForm.controls.month.value.toString().trim() +
          //     "/" +
          //     this.userEditProfileForm.controls.day.value.toString().trim() +
          //     "/" +
          //     this.userEditProfileForm.controls.year.value.toString().trim()
          //   : undefined;
          this.httpService
            .patch(environment.serverUrl + environment.user.patchData, {
              full_name: this.userEditProfileForm.controls.fullname.value.trim(),
              mobile_phone: this.userEditProfileForm.controls.phone.value.trim(),
              city: this.userEditProfileForm.controls.city.value.trim(),
              // birthdate: this.birthDayDate,
            })
            .subscribe(
              (response: any) => {
                this.ui.dismissLoading();
                if (response.status == 200) {
                  this.userSvc.getData();
                  this.goToProfile();
                } else {
                  this.httpError = "Campos del formulario invalidos";
                }
              },
              (e) => {
                this.ui.dismissLoading();
                this.httpError = "Campos del formulario invalidos";
              }
            );
        } else {
          this.httpError = "Campos del formulario invalidos";
        }
      }
    }
  }

  screnSize(size: string, reverse: boolean) {
    if (size != "xs") {
      if (reverse) {
        return "flex-direction-row-reverse";
      }
      return "flex-direction-row";
    } else {
      return "flex-direction-column";
    }
  }

  goToProfile() {
    this.router.navigate(["user/profile"], {
      queryParamsHandling: "preserve",
    });
  }
}
