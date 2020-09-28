import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { HttpService } from "../../../../../../_services/http.service";
import { Router } from "@angular/router";
import { User } from "../../../../../../_models/User";
import { SHA256, SHA512 } from "crypto-js";
import { UiService } from "../../../../../../_services/ui.service";
import { HeaderComponent } from "src/app/_modules/utils/_components/header/header.component";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Component({
  selector: "user-activation",
  templateUrl: "./activation.page.html",
  styleUrls: ["./activation.page.scss"],
})
export class ActivationPage implements OnInit {
  public userActivationForm: FormGroup;
  public userActivation: User = new User();
  public httpError: string;

  @ViewChild(HeaderComponent) header: HeaderComponent;
  title: string = "activa tu cuenta";
  prevUrl: string = "/home";

  constructor(
    private formBuilder: FormBuilder,
    public httpService: HttpService,
    private router: Router,
    private ui: UiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initforms();
  }

  ngAfterViewInit(): void {}

  initforms() {
    this.userActivationForm = this.formBuilder.group({
      codeNumber: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(11),
      ]),
    });
  }

  saveUser(): void {
    this.ui.showLoading();
    const email256 = SHA256(this.userActivation.email).toString();
    this.httpService
      .post(
        "https://becks.flexitco.co/becks-back/api/ab-inbev-api-usercustom/",
        this.userActivation
      )
      .subscribe(
        (data: any) => {
          try {
            this.ui.dismissLoading();
            this.userActivationForm.reset();
            window.dataLayer.push({
              event: "trackEvent",
              eventCategory: "becks society",
              eventAction: "finalizar",
              eventLabel: email256,
            });
          } catch (e) {}
          this.router.navigate(["user"]);
        },
        (err) => {
          if (err.error) {
            this.httpError = err.error.message;
          }
          this.ui.dismissLoading();
        }
      );
  }

  public inputValidatorNumeric(event: any) {
    const pattern = /^[0-9]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9]/g, "");
    }
  }

  public inputValidatorAlphaNumeric(event: any) {
    const pattern = /^[a-zA-ZnÑ0-9 ]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-ZnÑ0-9 ]/g, "");
    }
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
    if (item.hasError("required")) {
      return "Este campo es obligatorio";
    } else if (item.hasError("maxlength")) {
      return "Máximo " + max;
    } else if (item.hasError("minlength")) {
      return "Mínimo " + min;
    } else if (item.hasError("pattern")) {
      return "Ingrese solo letras";
    }
  }
}
