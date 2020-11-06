import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { environment } from 'src/environments/environment';
import { SHA256 } from "crypto-js";
import { AuthService } from 'src/app/_services/auth.service';
import { User } from 'src/app/_models/User';
import { HttpService } from 'src/app/_services/http.service';
import { UiService } from 'src/app/_services/ui.service';
import { AdminService } from 'src/app/_services/admin.service';
declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Component({
  selector: 'edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
})
export class EditFormComponent implements OnInit,AfterViewInit {
  public userEditForm: FormGroup;
  public userRegister: User = new User();
  public captchaStatus: boolean;
  public restartCaptcha: boolean;
  public httpError: string;

  public hideStk: boolean=true;
  public checked: boolean=false;
  public hidepath: boolean=true;
  public password: string;
  public showError: boolean;
  public photo: any;
  @Input() parentFunc:any;

  constructor(
    private formBuilder: FormBuilder,
    public httpService: HttpService,
    private router: Router,
    private ui: UiService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private adminSvc: AdminService,
  ) { }

  ngOnInit(): void {
    this.initforms();
  }

  ngAfterViewInit(): void {

  }

  initforms() {
    this.userEditForm = this.formBuilder.group({
      name: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ]),
      descrip: new FormControl("", [
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(150),
      ]),
      stock: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6),
      ]),
      period: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6),
      ]),
      location: new FormControl("", [
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(10),
      ]),
      dateEnd: new FormControl(null, Validators.required),
      dateStart: new FormControl(null, Validators.required),
      dateRelease: new FormControl(null, Validators.required),
      path: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(150),
      ]),
    });
  }

  saveUser(): void {

    if ( this.userEditForm.invalid) {
      this.showError = true;
      (<any>Object).values(this.userEditForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.ui.showLoading();
    this.restartCaptcha = true;
    this.showError = false;
    const email256 = SHA256(this.userRegister.email).toString();
    this.userRegister.type_id = "CC";
    this.httpService
      .post(
        environment.serverUrl + environment,
        this.userRegister.toJSON()
      )
      .subscribe(
        (res: any) => {
          try {
            if ( res.status >= 200 && res.status < 300 ) {
                window.dataLayer.push({
                  event: "trackEvent",
                  eventCategory: "fase 3",
                  eventAction: "finalizar fase 3",
                  eventLabel: email256,
                });
                // window.location.reload();
                // this.ui.showModal( BasicAlertComponent, "modalMessage", false, false, {
                //   title: "Bienvenido a Beck's",
                //   description: "Ingresando de forma segura",
                // });

                const formData = new FormData();
                try {
                  this.restartCaptcha = true;
                  formData.append("username", this.userEditForm.controls.email.value.trim());
                  formData.append("password", this.userEditForm.controls.password.value.trim());
                  formData.append("grant_type", environment.rest.grant_type);
                  formData.append("client_id", environment.rest.client_id);
                  formData.append("client_secret", environment.rest.client_secret);
                  formData.append("scope", environment.rest.scope);
                } catch (error) {
                  return;
                }
                this.userEditForm.reset();
                this.httpService
                .postFormData(
                  environment.serverUrl + environment.login.resource,
                  formData
                )
                .subscribe(
                  (response: any) => {
                    this.ui.dismissLoading();
                    if ( response.status >= 200 && response.status < 300 ) {
                      this.restartCaptcha = false;
                      this.ui.dismissModal(2500);
                      this.ui.dismissLoading(2500);
                      this.authService.setAuthenticated(
                        "Bearer " + response.body.access_token
                      );
                      this.router.navigate(["user/exp"], {
                        queryParamsHandling: "preserve",
                      });
                    } else {
                      location.reload();  
                    }
                  }, (e) => {
                    location.reload();
                  });
                  
            } else {
              this.showError = true;
            }
            
          } catch (e) {
            this.showError = true;
          }
        },
        (err) => {
          this.showError = true;
          this.restartCaptcha = false;
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

  public inputValidatorAlphabetical(event: any) {
    const pattern = /^[a-zA-ZnÑ ]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-ZnÑ ]/g, "");
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
    min?: number,
    max?: number
  ): string {
    if (item.hasError("required")) {
      return "Este campo es obligatorio";
    } else if (item.hasError("maxlength")) {
      return "Máximo " + max;
    } else if (item.hasError("minlength")) {
      return "Mínimo " + min;
    } else if (
      item.hasError("email") ||
      (item.hasError("pattern") && name === "email")
    ) {
      return "Ingrese una dirección de correo electrónico válida";
    } else if (item.hasError("pattern")) {
      return "Ingrese solo letras";
    }
  }


  
  loadImageFromDevice(event) {
    var files = event.target.files;
    var img = new Image();
    img = files[0];
    console.log(img);
    this.resizeImage(files[0], 720, 480).then((blob) => {
      if (files && blob) {
        var reader = new FileReader();
        // reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsBinaryString(blob);
      }
    });
    this.ui.dismissModal()
  }

  
  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.photo = btoa(binaryString);
    this.ui.showLoading();
    this.httpService
      .patch(environment.serverUrl + environment, {
        photo: this.photo,
      })
      .subscribe((response: any) => {
        this.adminSvc.getData();
        this.adminSvc.editing();
        this.ui.dismissLoading();
      });
  }


  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        let width = image.width;
        let height = image.height;
        if (width <= maxWidth && height <= maxHeight) {
          resolve(file);
        }
        let newWidth;
        let newHeight;
        if (width > height) {
          newHeight = height * (maxWidth / width);
          newWidth = maxWidth;
        } else {
          newWidth = width * (maxHeight / height);
          newHeight = maxHeight;
        }
        let canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, newWidth, newHeight);
        canvas.toBlob(resolve, file.type);
      };
      image.onerror = reject;
      console.log(image.src);
    });
  }
  closeForm() {
    this.parentFunc();
  }

  hideField(targetHidden,targetStatus){
    console.log(targetStatus);
    if(targetHidden == "stk"){
      this.hideStk = !this.hideStk;
    }
    else if (targetHidden  == "path") {
      this.hidepath = ! this.hidepath;
    }
  }
  unCheck(){
  this.checked=!this.checked;
  }
}
