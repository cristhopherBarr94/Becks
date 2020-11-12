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
  FormArray,
} from "@angular/forms";
import { Router } from "@angular/router";
import { environment } from 'src/environments/environment';
import { SHA256 } from "crypto-js";
import { AuthService } from 'src/app/_services/auth.service';
import { User } from 'src/app/_models/User';
import { HttpService } from 'src/app/_services/http.service';
import { UiService } from 'src/app/_services/ui.service';
import { AdminService } from 'src/app/_services/admin.service';
import { PopUpComponent } from 'src/app/_modules/admin/_components/pop-up/pop-up.component';
declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Component({
  selector: 'create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss'],
})
export class CreateFormComponent implements OnInit,AfterViewInit {
  public userEditForm: FormGroup;
  public userRegister: User = new User();
  public captchaStatus: boolean;
  public restartCaptcha: boolean;
  public httpError: string;
  public loadedFileMob:string = "";
  public loadedFileDes:string = "";
  public loadMob:string; 
  public loadDes:string; 
  public hideStk: boolean = true;
  public hidePed: boolean = true;
  public hidepath: boolean = true;
  public checked: boolean = false;
  public password: string;
  public showError: boolean = false;
  public typeError:boolean = false;
  public photo: any;
  public checkIn:boolean =  !this.checked;
  public checkOut:boolean = this.checked;
  public title_modal:string;
  public sub_title_modal:string;
  public title_button_modal:string;
  public arrPeriod = [];
  @Input() parentFunc:any;
  @Input() preload:any;

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

  ngAfterViewInit(): void { }

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
  initItemRows (){
    return this.formBuilder.group ({
      stock: new FormControl("", [
        Validators.minLength(1),
        Validators.maxLength(10),
      ]),
      date: new FormControl("",null),
    });
  }
  saveUser(): void {

    if ( this.userEditForm.invalid || this.loadedFileDes.length == 0 || this.loadedFileMob.length == 0  ) {
      this.showError = true;
      (<any>Object).values(this.userEditForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.title_modal ="SE HAN GUARDADO LOS CAMBIOS CON ÉXITO";
    this.sub_title_modal =" ";
    this.title_button_modal ="ACEPTAR";
    console.log(this.userEditForm.controls.name.value);
    console.log(new Date(this.userEditForm.controls.dateStart.value).getTime()/1000);
    console.log(new Date(this.userEditForm.controls.dateEnd.value).getTime()/1000);
    console.log(this.userEditForm.controls.location.value);
    console.log(this.userEditForm.controls.descrip.value);
    console.log(this.userEditForm.controls.stock.value);
    this.formArr.value.forEach(element => {
      this.arrPeriod.push({"stock":element.stock,"date":(element.date).getTime()/1000});
      });
      console.log(this.arrPeriod)
    console.log(this.userEditForm.controls.path.value);
    console.log(this.checkIn);
    console.log(this.checkOut);
    console.log(this.loadDes);
    console.log(this.loadMob);
    this.ui.showLoading();
    this.httpService
      .post(
        environment.serverUrl + environment,
        this.userRegister.toJSON()
      )
      .subscribe(
        (res: any) => {
          try {
            if ( res.status >= 200 && res.status < 300 ) {
                const formData = new FormData();
                try {
                  formData.append("name", this.userEditForm.controls.name.value);
                  formData.append("date_1", this.userEditForm.controls.dateStart.value);
                  formData.append("date_2", this.userEditForm.controls.dateEnd.value);
                  formData.append("location", this.userEditForm.controls.location.value);
                  formData.append("description", this.userEditForm.controls.descrip.value);
                  formData.append("stock", this.userEditForm.controls.stock.value);
                  formData.append("periodicity", this.userEditForm.controls.period.value);
                  formData.append("date_3", this.userEditForm.controls.dateRelease.value);
                  formData.append("path", this.userEditForm.controls.path.value);
                  formData.append("check_inside", this.checkIn.toString());
                  formData.append("check_outside", this.checkOut.toString());
                  formData.append("img_des", this.loadedFileDes);
                  formData.append("img_mob", this.loadedFileMob);
                
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
                      this.ui.dismissModal(2500);
                      this.ui.dismissLoading(2500);
                      this.router.navigate(["admin/experiences"], {
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
    const pattern = /^[a-zA-ZnÑ,.!:á ]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-ZnÑ,.!:á ]/g, "");
    }
  }

  public inputValidatorAlphaNumeric(event: any) {
    const pattern = /^[a-zA-ZnÑ0-9,.!:á/ ]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-ZnÑ0-9,.!:á/ ]/g, "");
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
    } else {
      return "Ingrese un valor";
    }
  }


  
  loadImage(event,myPlatform) {
    var files = event.target.files;
    var imgn = new Image();
    imgn = files[0];

    if(files[0].type == "image/jpeg" || files[0].type == "image/png") {
      this.typeError = false;
      if(myPlatform == "des"){
        this.resizeImage(files[0], 1280, 720).then((blob) => {
          if (files && blob) {
            var reader = new FileReader();
            // reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsBinaryString(blob);
            this.loadedFileDes =imgn.name;

          }
          
        });
      }else if(myPlatform == "mob") {
        this.resizeImage(files[0], 720, 480).then((blob) => {
          if (files && blob) {
            var reader = new FileReader();
            // reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsBinaryString(blob);
            this.loadedFileMob =imgn.name; 

          }
        });
      }
      this.ui.dismissModal()

    }else{
      this.typeError = true;
    }
  
  }

  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = URL.createObjectURL(file);
      if(maxWidth == 720) {
        this.loadMob =image.src; 
      }else  if(maxWidth == 1280) {
        this.loadDes =image.src; 
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
    this.parentFunc();
    this.closeModal();
    location.reload();
  }
  closeModal() {
    this.ui.dismissModal();
  }

  hideField(targetHidden,targetStatus){
    // console.log(targetHidden,targetStatus);
    if(targetHidden == "stk"){
      this.hideStk = !this.hideStk;
      if(targetStatus==true){
        this.userEditForm.controls.itemRows['controls'][0].controls.period.reset();
        this.userEditForm.controls.itemRows['controls'][0].controls.dateRelease.reset();
      }else{
      this.userEditForm.controls.stock.reset();
      }
    }else if(targetHidden == "ped") {
      this.hidePed = !this.hidePed;
      if(this.hideStk == false){
        this.hideStk = true;
      }
      if(targetStatus==true){
        this.userEditForm.controls.stock.reset();
      }else{
        this.userEditForm.controls.itemRows['controls'][0].controls.period.reset();
        this.userEditForm.controls.itemRows['controls'][0].controls.dateRelease.reset();
      }

    }
    else if (targetHidden  == "path") {
      this.hidepath = ! this.hidepath;
      if(targetStatus==true){
        this.userEditForm.controls.itemRows['controls'][0].controls.period.reset();
        this.userEditForm.controls.itemRows['controls'][0].controls.dateRelease.reset();
        this.userEditForm.controls.stock.reset();
      }else{
      this.userEditForm.controls.path.reset();
      }
    }
  }
  unCheck(chk){
  this.checked=!this.checked;
  if(chk.source.id=="mat-checkbox-inside"){
    this.checkIn = chk.checked;
    this.checkOut = !chk.checked;
  
  }else if (chk.source.id=="mat-checkbox-outside") {
    this.checkIn = !chk.checked;
    this.checkOut = chk.checked;
  }
  }

  clear(tg) {
    if(tg=="D") {
      this.loadedFileDes="";
    }if(tg=="M") {
      this.loadedFileMob="";
    }
  }

  openModal() {
     this.title_modal ="RECUERDA QUE SI CANCELAS NO SE GUARDARÁN LOS CAMBIOS";
     this.sub_title_modal ="¿DESEAS CANCELAR?";
     this.title_button_modal ="CANCELAR";
    this.ui.showModal( PopUpComponent, "modalMessage", true, false, {
      title: this.title_modal,
      sub_title: this.sub_title_modal,
      title_button: this.title_button_modal,
      Func: this.closeForm.bind(this),
      FuncAlt: this.closeModal.bind(this),
    });  
  }

  get formArr() {
    return this.userEditForm.get('itemRows') as FormArray;
  }
  addField() {
    this.formArr.push(this.initItemRows());
  }
  deleteField(index:number) {
    this.formArr.removeAt(index);
  }
  
}
