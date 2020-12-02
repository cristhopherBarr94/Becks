import { Component, OnInit, Input, AfterViewInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { HttpService } from "src/app/_services/http.service";
import { UiService } from "src/app/_services/ui.service";
import { PopUpComponent } from "src/app/_modules/admin/_components/pop-up/pop-up.component";
import { Exp } from "src/app/_models/exp";
import { Subscription } from "rxjs";
import { ExperienciasService } from "src/app/_services/experiencias.service";
import { Observable } from "rxjs";
import { isEmpty, map, startWith } from "rxjs/operators";
import { MockCiudades } from "../../../../../../_mocks/ciudades-mock";
declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Component({
  selector: "create-form",
  templateUrl: "./create-form.component.html",
  styleUrls: ["./create-form.component.scss"],
})
export class CreateFormComponent implements OnInit, AfterViewInit {
  public userEditForm: FormGroup;
  public expEditable: Exp = new Exp();
  public captchaStatus: boolean;
  public restartCaptcha: boolean;
  public httpError: string;
  public loadedFileMob: string = "";
  public loadedFileDes: string = "";
  public loadMob: string;
  public loadDes: string;
  public hideStk: boolean = true;
  public hidePed: boolean = true;
  public hidepath: boolean = true;
  public checked: boolean = false;
  public password: string;
  public showError: boolean = false;
  public typeErrorDes: boolean = false;
  public typeErrorMob: boolean = false;
  public photoDes: any;
  public photoMob: any;
  public checkIn: boolean = !this.checked;
  public checkOut: boolean = this.checked;
  public title_modal: string =
    "RECUERDA QUE SI CANCELAS NO SE GUARDARÁN LOS CAMBIOS";
  public sub_title_modal: string = "¿DESEAS CANCELAR?";
  public title_button_modal: string = "CANCELAR";
  public arrPeriod = [];
  public experiencienContent = [];
  public nameExp: string;
  public minDate: any;
  public id: number;
  public stoks = [];
  public minDate1 = new Date();
  public minDate2 = new Date(
    this.minDate1.getMonth() +
      1 +
      "/" +
      this.minDate1.getDay() +
      "/" +
      this.minDate1.getFullYear()
  );
  @Input() parentFunc: any;
  @Input() preload: any;

  experienceSubs: Subscription;
  editSubs: Subscription;
  options: string[] = MockCiudades;
  filteredCityOptions: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    public httpService: HttpService,
    private router: Router,
    private ui: UiService,
    private expService: ExperienciasService
  ) {}

  ngOnInit(): void {
    this.initforms();
    this.filteredCityOptions = this.userEditForm.controls.location.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
    console.log(this.minDate1, this.minDate2);
  }

  private _filter(value: string): string[] {
    if (value == undefined || value == null) {
      return;
    }
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  ngAfterViewInit(): void {}

  initforms() {
    this.userEditForm = this.formBuilder.group({
      name: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100),
      ]),
      descrip: new FormControl("", [
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(500),
      ]),
      location: new FormControl("", [
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(100),
      ]),
      stock: new FormControl("", [
        Validators.minLength(1),
        Validators.maxLength(10),
      ]),
      itemRows: this.formBuilder.array([this.initItemRows()]),
      path: new FormControl("", [
        Validators.minLength(4),
        Validators.maxLength(150),
      ]),
      dateEnd: new FormControl("", Validators.required),
      dateStart: new FormControl("", Validators.required),
      insideCheck: new FormControl("", null),
      outsideCheck: new FormControl("", null),
    });
  }
  initItemRows() {
    return this.formBuilder.group({
      period: new FormControl("", [
        Validators.minLength(1),
        Validators.maxLength(10),
      ]),
      dateRelease: new FormControl("", null),
    });
  }
  saveExp(): void {
    if (
      this.userEditForm.controls.name.invalid ||
      this.userEditForm.controls.dateStart.invalid ||
      this.userEditForm.controls.dateEnd.invalid ||
      this.userEditForm.controls.location.invalid ||
      this.userEditForm.controls.descrip.invalid ||
      this.loadedFileDes.length == 0 ||
      this.loadedFileMob.length == 0
    ) {
      this.showError = true;
      (<any>Object).values(this.userEditForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    this.userEditForm.get("itemRows").value.forEach((element) => {
      if (
        (element.period == null && element.dateRelease == null) ||
        (element.period == "" && element.dateRelease == "")
      ) {
        this.arrPeriod.push({
          stock: this.userEditForm.controls.stock.value,
          date: Math.floor(new Date().getTime() / 1000),
        });
      } else {
        this.arrPeriod.push({
          stock: element.period,
          date: Math.floor(new Date().getTime() / 1000),
        });
      }
    });
    this.ui.showLoading();
    this.httpService
      .post(environment.serverUrl + environment.admin.postExp, {
        title: this.userEditForm.controls.name.value,
        description: this.userEditForm.controls.descrip.value,
        location: this.userEditForm.controls.location.value,
        valid_from: Math.floor(
          this.userEditForm.controls.dateStart.value.getTime() / 1000
        ),
        valid_to: Math.floor(
          this.userEditForm.controls.dateEnd.value.getTime() / 1000
        ),
        stock: this.arrPeriod,
        img_desk: this.photoDes.split(",")[1],
        img_mob: this.photoMob.split(",")[1],
      })
      .subscribe(
        (response: any) => {
          this.ui.dismissLoading();
          if (response.status >= 200 && response.status < 300) {
            this.title_modal = "SE HAN GUARDADO LOS CAMBIOS CON ÉXITO";
            this.sub_title_modal = " ";
            this.title_button_modal = "ACEPTAR";
            this.ui.showModal(PopUpComponent, "modalMessage", true, false, {
              title: this.title_modal,
              sub_title: this.sub_title_modal,
              title_button: this.title_button_modal,
              Func: this.reload.bind(this),
              FuncAlt: this.closeModal.bind(this),
            });
          } else {
            // TODO :: logic for error
          }
        },
        (error) => {
          // TODO :: logic for error
          console.log("error enviando datos");
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
    const pattern = /^[a-zA-ZnÑ,.!:áÁéÉíÍóÓúÚ?¿"; ]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-ZnÑ,.!:á ]/g, "");
    }
  }

  public inputValidatorAlphaNumeric(event: any) {
    const pattern = /^[a-zA-ZnÑ0-9,.!áÁéÉíÍóÓúÚ/¡?¿"; ]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(
        /[^a-zA-ZnÑ0-9,.!:á/ ]/g,
        ""
      );
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

  public getClassInputNotReq(item: any): string {
    let classreturn = "input-becks";
    if (item.valid && item.value > 0) {
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

  loadImage(event, myPlatform) {
    var files = event.target.files;
    var imgn = new Image();
    imgn = files[0];
    console.log(files[0].size);
    if (files[0].type == "image/jpeg" || files[0].type == "image/png") {
      this.typeErrorDes = false;
      this.typeErrorMob = false;

      if (myPlatform == "des") {
        if (files[0].size <= 1000000) {
          this.resizeImage(files[0], 1280, 720).then((blob) => {
            if (files && blob) {
              var reader = new FileReader();
              reader.readAsBinaryString(blob);
              this.loadedFileDes = imgn.name;
              this.toBase64(blob, myPlatform);
            }
          });
        } else {
          this.typeErrorDes = true;
        }
      } else if (myPlatform == "mob") {
        if (files[0].size <= 500000) {
          this.resizeImage(files[0], 720, 480).then((blob) => {
            if (files && blob) {
              var reader = new FileReader();
              reader.readAsBinaryString(blob);
              this.loadedFileMob = imgn.name;
              this.toBase64(blob, myPlatform);
            }
          });
        } else {
          this.typeErrorMob = true;
        }
      }
    }
    this.ui.dismissModal();
  }
  toBase64(blob, type) {
    var reader2 = new FileReader();
    reader2.readAsDataURL(blob);
    if (type == "des") {
      reader2.onloadend = () => {
        this.photoDes = reader2.result;
      };
    } else if (type == "mob") {
      reader2.onloadend = () => {
        this.photoMob = reader2.result;
      };
    }
  }

  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = URL.createObjectURL(file);
      if (maxWidth == 720) {
        this.loadMob = image.src;
      } else if (maxWidth == 1280) {
        this.loadDes = image.src;
      }

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
    });
  }

  closeForm() {
    this.closeModal();
    location.reload();
  }
  closeModal() {
    this.ui.dismissModal();
  }

  hideField(targetHidden, targetStatus) {
    if (targetHidden == "stk") {
      this.hideStk = !this.hideStk;
      if (targetStatus == true) {
        this.hidePed = true;
        this.userEditForm.controls.itemRows["controls"].forEach((field) => {
          field.controls.period.reset();
          field.controls.period.setValue("");
          field.controls.dateRelease.reset();
          field.controls.dateRelease.setValue("");
        });
      } else {
        this.userEditForm.controls.stock.reset();
        this.userEditForm.controls.stock.setValue("");
      }
    } else if (targetHidden == "ped") {
      this.hidePed = !this.hidePed;
      if (this.hideStk == false) {
        this.hideStk = true;
      }
      if (targetStatus == true) {
        this.userEditForm.controls.stock.reset();
        this.userEditForm.controls.stock.setValue("");
      } else {
        this.userEditForm.controls.itemRows["controls"].forEach((field) => {
          field.controls.period.reset();
          field.controls.period.setValue(" ");
          field.controls.dateRelease.reset();
          field.controls.dateRelease.setValue(" ");
        });
      }
    } else if (targetHidden == "path") {
      this.hidepath = !this.hidepath;
      if (targetStatus == true) {
      } else {
        this.userEditForm.controls.path.reset();
        this.userEditForm.controls.path.setValue(" ");
      }
    }
  }

  unCheck(chk) {
    this.checked = !this.checked;
    if (chk.source.id == "mat-checkbox-inside") {
      this.checkIn = chk.checked;
      this.checkOut = !chk.checked;
    } else if (chk.source.id == "mat-checkbox-outside") {
      this.checkIn = !chk.checked;
      this.checkOut = chk.checked;
    }
  }

  clear(tg) {
    if (tg == "D") {
      this.loadedFileDes = "";
    }
    if (tg == "M") {
      this.loadedFileMob = "";
    }
  }

  openModal() {
    this.ui.showModal(PopUpComponent, "modalMessage", true, false, {
      title: this.title_modal,
      sub_title: this.sub_title_modal,
      title_button: this.title_button_modal,
      Func: this.closeForm.bind(this),
      FuncAlt: this.closeModal.bind(this),
    });
  }

  addField() {
    (<FormArray>this.userEditForm.get("itemRows")).push(this.initItemRows());
  }
  deleteField(index: number) {
    (<FormArray>this.userEditForm.get("itemRows")).removeAt(index);
  }
  reload() {
    location.reload();
  }
}
