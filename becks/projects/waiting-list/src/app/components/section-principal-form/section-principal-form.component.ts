import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../model/User';
import { SHA256, SHA512 } from "crypto-js";
import { UiService } from 'src/app/services/ui.service';

declare global {
  interface Window { dataLayer: any[]; }
}

@Component({
  selector: 'app-section-principal-form',
  templateUrl: './section-principal-form.component.html',
  styleUrls: ['./section-principal-form.component.scss'],
})
export class SectionPrincipalFormComponent implements OnInit, AfterViewInit {

  public userRegisterForm: FormGroup;
  public userRegister: User = new User();
  public captchaStatus: boolean;
  public restartCaptcha: boolean;
  public httpError: string;
  @Input() principalContent;

  constructor(private formBuilder: FormBuilder,
              public userService: UserService,
              private router: Router,
              private ui: UiService) {}

    ngOnInit(): void {
      this.initforms();
    }

    ngAfterViewInit(): void {
      try {
        document.getElementById("mat-checkbox-promo")
        .getElementsByTagName('input')[0]
        .setAttribute('data-qadp',"input-marketing");  
      } catch (error) {}
    }

    initforms(){
      this.userRegisterForm = this.formBuilder.group({
        name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
        surname: new FormControl('', [Validators.required, Validators.maxLength(20)]),
        email: new FormControl('', [Validators.required, Validators.email,  Validators.maxLength(30)]),
        telephone: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]),
        gender: new FormControl(null, Validators.required),
        privacy: new FormControl(null, Validators.required),
        promo: new FormControl(null)
      });
    }

    saveUser(): void {
      this.ui.showLoading();
      this.restartCaptcha = true;
      this.setCaptchaStatus( !this.restartCaptcha );
      this.userRegister.captcha_key = Math.floor( Math.random() * ( 999999999999 - 121212) + 121212 );
      this.userRegister.captcha = SHA512( 'setupCaptchaValidator("' + this.userRegister.email + '-' + this.userRegister.captcha_key + '")' ).toString();
      const email256 = SHA256(this.userRegister.email).toString();
      this.userService.setCreationUser(this.userRegister).subscribe(
        (data: any) => {
          this.restartCaptcha = false;
          this.ui.dismissLoading();
          this.userRegisterForm.reset();
          window.dataLayer.push({ 'event': 'trackEvent',
                                  'eventCategory': 'becks society', 
                                  'eventAction': 'finalizar', 
                                  'eventLabel': email256 
                                });
          this.moveSection();
          this.router.navigate(['confirm-register'], { queryParamsHandling: "preserve" });
        },
        (err) => {
          this.restartCaptcha = false;
          if ( err.error ) {
            this.httpError = err.error.message;
          }
          this.ui.dismissLoading();
        }
      );
    }

    public moveSection(){
      const y = document.getElementById('section-img').offsetTop;
      this.principalContent.scrollToPoint(0, y);
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


    public getClassInput(item: any): string {
      let classreturn = 'input-becks';
      if (item.valid) {
        classreturn = 'input-becks-ok';
      }
      else if (item.touched){
        classreturn = 'input-becks-error';
      }
      return classreturn;
    }

    public getClassInputSelect(item: any): string {
      let classreturn = 'select-becks';
      if (item.valid) {
        classreturn = 'select-becks-ok';
      }
      else if (item.touched){
        classreturn = 'select-becks-error';
      }
      return classreturn;
    }

    public getMessageform (item: any, name: string, min?: number, max?: number): string{
      if (item.hasError('required')) {
        return 'Ingrese un ' + name;
      } else if (item.hasError('maxlength')){
        return 'Máximo ' + max;
      } else if (item.hasError('minlength')){
        return 'Mínimo ' + min;
      } else if (item.hasError('email') || (item.hasError('pattern') && name === 'email')) {
        return 'Ingrese una dirección de correo electrónico válida';
      } else if (item.hasError('pattern')) {
        return 'Ingrese solo letras';
      }
    }

    public setCaptchaStatus( status ) {
      this.captchaStatus = status;
    }

}
