import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/User';
import { HttpService } from 'src/app/_services/http.service';
import { UiService } from 'src/app/_services/ui.service';
import { UserService } from 'src/app/_services/user.service';
import * as moment from "moment";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'user-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
})
export class EditFormComponent implements OnInit,OnDestroy {
  public user = new User();
  public userEditProfileForm: FormGroup;
  public birthDayDate: any;
  public size: string;
  userSubscription: Subscription;

  constructor( private userSvc: UserService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private ui: UiService,
    private httpService: HttpService,
    private platform: Platform) { 
      platform.ready().then(() => {
        this.platform.resize.subscribe(() => {
          this.size = this.ui.getSizeType(platform.width());
        });
        this.size = this.ui.getSizeType(platform.width());
      });
    }

  ngOnInit() {
    this.userSubscription = this.userSvc.user$.subscribe(
      (user) => {
        if ( user ) {
          this.user =  user;
        }
      }
    );
    if (this.userSvc.getActualUser()) {
      this.user = this.userSvc.getActualUser();     
    } else {
      this.userSvc.getData();
    }
    this.initforms();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  initforms() {
    this.userEditProfileForm = this.formBuilder.group({
      name: new FormControl(this.user.first_name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]),
      lastName: new FormControl(this.user.last_name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
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
      id: new FormControl(this.user.type_id),
      document: new FormControl(this.user.id_number,[Validators.required]),
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
    }else if (item.hasError("pattern")) {
      return "Ingrese solo letras";
    } else if (item.hasError("min") || item.hasError("max")) {
      return "Ingrese un valor entre " + min + " y " + max;
    }
  }

  saveChanges() {
    if (this.userEditProfileForm.valid) {
      this.ui.showLoading();
      this.birthDayDate =!!this.userEditProfileForm.controls.day.value ? 
          this.userEditProfileForm.controls.month.value +
        "/" +
        this.userEditProfileForm.controls.day.value +
        "/" +
        this.userEditProfileForm.controls.year.value: undefined

      this.httpService
        .patch(environment.serverUrl + environment.user.patchData, {
          first_name: this.userEditProfileForm.controls.name.value,
          last_name: this.userEditProfileForm.controls.lastName.value,
          mobile_phone: this.userEditProfileForm.controls.phone.value,
          birthdate: this.birthDayDate,
          type_id: this.userEditProfileForm.controls.id.value,
          id_number: this.userEditProfileForm.controls.document.value,
        })
        .subscribe((response: any) => {         
          if (response.status == 200) {            
            this.userSvc.getData();
          }
          this.ui.dismissLoading();
        }),
        (e) => {
          this.ui.dismissLoading();
        };

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
}
