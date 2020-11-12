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
import { AuthService } from 'src/app/_services/auth.service';
import { HttpService } from 'src/app/_services/http.service';
import { UiService } from 'src/app/_services/ui.service';
import { PopUpComponent } from 'src/app/_modules/admin/_components/pop-up/pop-up.component';
import { Exp } from 'src/app/_models/exp';
import { Subscription } from 'rxjs';
import { ExperienciasService } from 'src/app/_services/experiencias.service';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
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
  public expEditable: Exp = new Exp();
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
  public experiencienContent = [];
  public nameExp:string;
  public minDate:any;
  public id:number;
  @Input() parentFunc:any;
  @Input() preload:any;

  experienceSubs:Subscription;

  constructor(
    private formBuilder: FormBuilder,
    public httpService: HttpService,
    private router: Router,
    private ui: UiService,
    private expService: ExperienciasService,
  ) {}

  ngOnInit(): void {
    this.expEditable.stock = [{stock: "5", date: new Date(1605135600*1000)},
    {stock: "6", date: new Date(1605135600*1000)},
    {stock: "7", date: new Date(1605135600*1000)}];
    const s = this.router.url;
    this.id = Number(s.substr(s.lastIndexOf('/') + 1));

    this.experienceSubs = this.expService.exp$.subscribe(exps => {
      if ( exps && exps.length > 0 ) {
           exps.forEach(content => {
              if(content.id == this.id) {

             this.expEditable.titleExp = content.titleExp;
              this.expEditable.dateStart = new Date((content.dateStart));
              this.expEditable.dateEnd = new Date((content.dateStart));
              this.expEditable.descrip = content.descrip;
              this.expEditable.location = content.location;
              this.expEditable.path = content.path;
              this.loadMob = content.imagesExpMob; 
              this.loadDes = content.imagesExp;
              this.loadedFileMob = this.loadMob;
              this.loadedFileDes = this.loadDes;
              console.log((content.dateStart));
              if(this.expEditable.stock.length == 1) {
                this.hideStk = !this.hideStk;
              }else  if(this.expEditable.stock.length > 1) {
                this.hidePed = false;
              }
            // if(this.expEditable.path.length == null) {
            //     this.hidepath = !this.hidepath;
            //     // if(!this.expEditable.checkIn) {
            //     //   this.checked = !this.checked;
            //     // }
            //   }
              this.editExp();

              }
           });
      }
    });
    this.expService.getData();
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
      period: new FormControl("", [
        Validators.minLength(1),
        Validators.maxLength(10),
      ]),
      dateRelease: new FormControl("",null),
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
    console.log(this.userEditForm.controls.dateStart.value);
    console.log(this.userEditForm.controls.dateEnd.value);
    console.log(this.userEditForm.controls.location.value);
    console.log(this.userEditForm.controls.descrip.value);
    console.log(this.arrPeriod)
    console.log(this.userEditForm.controls.path.value);
    console.log(this.checkIn);
    console.log(this.checkOut);
    console.log(this.loadDes);
    console.log(this.loadMob);
    this.ui.showLoading();
    this.httpService
      .post(
        environment.serverUrl + environment
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
    this.closeModal();
    this.router.navigate([`admin/exp`], {
      queryParamsHandling: "preserve",
      state: { reload: 'true' }
    });
  }
  closeModal() {
    this.ui.dismissModal();
  }

  hideField(targetHidden,targetStatus){
    // console.log(targetHidden,targetStatus);
    if(targetHidden == "stk"){
      this.hideStk = !this.hideStk;
      if(targetStatus==true){
        this.userEditForm.controls.itemRows.controls[0].controls.period.reset();
        this.userEditForm.controls.itemRows.controls[0].controls.period.removeAttr("required");
        this.userEditForm.controls.itemRows.controls[0].controls.dateRelease.reset();
        this.userEditForm.controls.itemRows.controls[0].controls.dateRelease.removeAttr("required");
      }else{
      this.userEditForm.controls.stock.reset();
      this.userEditForm.controls.stock.setValue(" ");
      }
    }else if(targetHidden == "ped") {
      this.hidePed = !this.hidePed;
      if(this.hideStk == false){
        this.hideStk = true;
      }
      if(targetStatus==true){
        this.userEditForm.controls.stock.reset();
        this.userEditForm.controls.stock.setValue(" ");
      }else{
        this.userEditForm.controls.itemRows.controls[0].controls.period.reset();
        this.userEditForm.controls.itemRows.controls[0].controls.period.setValue(" ");
        this.userEditForm.controls.itemRows.controls[0].controls.dateRelease.reset();
        this.userEditForm.controls.itemRows.controls[0].controls.dateRelease.setValue("");
      }

    }
    else if (targetHidden  == "path") {
      this.hidepath = ! this.hidepath;
      if(targetStatus==true){
        this.userEditForm.controls.itemRows.controls[0].controls.period.reset();
        this.userEditForm.controls.itemRows.controls[0].controls.period.setValue(" ");
        this.userEditForm.controls.itemRows.controls[0].controls.dateRelease.reset();
        this.userEditForm.controls.itemRows.controls[0].controls.dateRelease.setValue(" ");
        this.userEditForm.controls.stock.reset();
        this.userEditForm.controls.stock.setValue(" ");

      }else{
      this.userEditForm.controls.path.reset();
      this.userEditForm.controls.path.setValue(" ");

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

  editExp() {
    console.log(this.expEditable.titleExp)
    this.userEditForm.patchValue({
      name: this.expEditable.titleExp,
      descrip: this.expEditable.descrip,
      location: this.expEditable.location,
      stock: 5, 
      path:this.expEditable.path,
      dateEnd: this.expEditable.dateEnd,
      dateStart: this.expEditable.dateStart,

    });

    this.userEditForm.setControl('itemRows',this.setExistingPeriodicity());
  }
  setExistingPeriodicity():FormArray{
    let formArray = new FormArray([]);
    this.expEditable.stock.forEach(e=>{
      formArray.push(this.formBuilder.group({
        period: e.stock,
        dateRelease: new Date (e.date),
      }));

    });
    
    formArray.value.forEach(element => {
      this.arrPeriod.push({"stock":element.period,"date":(element.dateRelease).getTime()/1000});
      });
    return formArray;
  }
  

  addField() {
    (<FormArray>this.userEditForm.get('itemRows')).push(this.initItemRows());
  }
  deleteField(index:number) {
    (<FormArray>this.userEditForm.get('itemRows')).removeAt(index);
  }
}