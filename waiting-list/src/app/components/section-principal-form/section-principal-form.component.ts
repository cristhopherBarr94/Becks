import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../model/User';
import { SHA512 } from "crypto-js";
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-section-principal-form',
  templateUrl: './section-principal-form.component.html',
  styleUrls: ['./section-principal-form.component.scss'],
})
export class SectionPrincipalFormComponent implements OnInit {

  public userRegisterForm: FormGroup;
  public userRegister: User = new User();
  public captchaStatus: boolean;
  public restartCaptcha: boolean;


  constructor(private formBuilder: FormBuilder,
              public userService: UserService,
              private router: Router,
              private ui: UiService) {}

    ngOnInit() {
      this.initforms();
    }

    initforms(){
      this.userRegisterForm = this.formBuilder.group({
            name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            surname: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            email: new FormControl('', [Validators.required, Validators.email,  Validators.maxLength(30)]),
            prefix: new FormControl('', [Validators.required, Validators.maxLength(3)]),
            telephone: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]),
            gender: new FormControl(null, Validators.required)
          });
    }

    saveUser(): void {
      this.ui.showLoading();
      this.restartCaptcha = true;
      this.userRegister.captcha_key = Math.floor( Math.random() * ( 999999999999 - 121212) + 121212 );
      this.userRegister.captcha = SHA512( 'setupCaptchaValidator("' + this.userRegister.email + '-' + this.userRegister.captcha_key + '")' ).toString();
      this.userRegister.mobile_phone = '+' + this.userRegister.prefix + this.userRegister.phone;
      this.userService.setCreationUser(this.userRegister).subscribe(
        (data: any) => {
          this.ui.dismissLoading();
          this.restartCaptcha = false;
          this.userRegisterForm.reset();
          this.router.navigate(['confirm-register']);
        },
        err => {
          // console.error('Save User' , err);
          this.ui.dismissLoading();
        }
      );
    }

    public inputValidatorNumeric(event: any) {
      const pattern = /^[0-9]*$/;
      if (!pattern.test(event.target.value)) {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
      }
    }

    public inputValidatorAlphabetical(event: any) {
      const pattern = /^[a-zA-ZnÑ ]*$/;
      if (!pattern.test(event.target.value)) {
        event.target.value = event.target.value.replace(/[^a-zA-ZnÑ ]/g, '');
      }
    }


    public getClassInput(item: FormControl): string {
      let classreturn = 'input-becks';
      if (item.valid) {
        classreturn = 'input-becks-ok';
      }
      else if (item.touched){
        classreturn = 'input-becks-error';
      }
      return classreturn;
    }

    public getClassInputSelect(item: FormControl): string {
      let classreturn = 'select-becks';
      if (item.valid) {
        classreturn = 'select-becks-ok';
      }
      else if (item.touched){
        classreturn = 'select-becks-error';
      }
      return classreturn;
    }

    public getMessageform (item: FormControl, name: string, min?: number, max?: number): string{
      if (item.hasError('required')) {
        return 'Ingrese un ' + name;
      } else if (item.hasError('maxlength')){
        return 'Maximo ' + max;
      } else if (item.hasError('minlength')){
        return 'Minimo ' + min;
      } else if (item.hasError('pattern')) {
        return 'Ingrese solo letras';
      } else if (item.hasError('email')) {
        return 'Ingrese un email válido';
      }
    }

    public setCaptchaStatus( status ) {
      this.captchaStatus = status;
    }

}
