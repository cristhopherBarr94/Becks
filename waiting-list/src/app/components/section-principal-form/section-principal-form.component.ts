import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../model/User';
import { SHA512 } from "crypto-js";

@Component({
  selector: 'app-section-principal-form',
  templateUrl: './section-principal-form.component.html',
  styleUrls: ['./section-principal-form.component.scss'],
})
export class SectionPrincipalFormComponent implements OnInit {

  public userRegisterForm: FormGroup;
  public userRegister: User = new User();

  public userAnswer = { value: -1, icon: '', title: '' };
  public userCaptcha = { question: null , answers: [] };
  private captchaAnswer = { value: -1, icon: '', title: '' };
  private captchaQuestions = [
    { value: 0, icon: 'home', title: 'la Casa' },
    { value: 1, icon: 'airplanemode_on', title: 'el Avión' },
    { value: 2, icon: 'accessibility', title: 'la Persona' },
    { value: 3, icon: 'camera_alt', title: 'la Camara' },
    { value: 4, icon: 'airport_shuttle', title: 'el Bus' },
    { value: 5, icon: 'beach_access', title: 'la Sombrilla' },
    { value: 6, icon: 'cake', title: 'el Pastel' },
    { value: 7, icon: 'insert_emoticon', title: 'la Cara Feliz' },
    { value: 8, icon: 'brush', title: 'el Pincel' },
    { value: 9, icon: 'construction', title: 'las Herramientas' },
    { value: 10, icon: 'cloud', title: 'la Nube' },
    { value: 11, icon: 'content_cut', title: 'la Tijera' },
    { value: 12, icon: 'create', title: 'el Lápiz' },
    { value: 13, icon: 'two_wheeler', title: 'la Motocicleta' },
    { value: 14, icon: 'emoji_objects', title: 'el Bombillo' },
    { value: 15, icon: 'favorite', title: 'el Corazón' },
    { value: 16, icon: 'flash_on', title: 'el Rayo' },
    { value: 17, icon: 'notifications', title: 'la Campana' },
    { value: 18, icon: 'restaurant', title: 'los Cubiertos' },
    { value: 19, icon: 'smoking_rooms', title: 'el Cigarrillo' },
    { value: 20, icon: 'watch', title: 'el Reloj' }
  ];

  constructor(private formBuilder: FormBuilder,
              public userService: UserService,
              private router: Router) { }

    ngOnInit() {
      this.initforms();
      this.initCaptcha();
    }

    initforms(){
      this.userRegisterForm = this.formBuilder.group({
            name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            surname: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            email: new FormControl('', [Validators.required, Validators.email,  Validators.maxLength(30)]),
            prefix: new FormControl('', [Validators.required, Validators.maxLength(3)]),
            telephone: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]),
            gender: new FormControl(null, Validators.required),
            captcha: new FormControl(null, Validators.required)
          });
    }

    saveUser(): void {
      this.userRegister.captcha_key = Math.floor( Math.random() * ( 999999999999 - 121212) + 121212 );
      this.userRegister.captcha = SHA512( 'setupCaptchaValidator("' + this.userRegister.email + '-' + this.userRegister.captcha_key + '")' ).toString();
      this.userRegister.mobile_phone = '+' + this.userRegister.prefix + this.userRegister.phone;
      this.userService.setCreationUser(this.userRegister).subscribe(
        (data: any) => {
          this.userRegisterForm.reset();
          this.initCaptcha();
          this.router.navigate(['confirm-register']);
        },
        err => {}
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

    public initCaptcha() {
      this.userCaptcha.question = null;
      this.userCaptcha.answers = [];
      this.captchaAnswer = null;

      let questions = this.captchaQuestions;
      let iq = Math.floor(Math.random() * questions.length);
      this.captchaAnswer = questions[iq];
      this.userCaptcha.answers.push( this.captchaAnswer );

      questions.splice( iq, 1 );
      for( let i = 0; i < 3; i++) {
        iq = Math.floor( Math.random() * questions.length );
        this.userCaptcha.answers.push( questions[iq] );
        questions.splice( iq, 1 );
      }

      this.userCaptcha.answers = this.userCaptcha.answers.sort( () => Math.random() - 0.5);
      this.userCaptcha.question = "Seleccione " + this.captchaAnswer.title;
    }

    public checkCaptcha( answer ) {
      this.userAnswer = answer;
      if ( this.captchaAnswer.value != this.userAnswer.value ) {
        this.userRegisterForm.controls.captcha.setValue(null);
      }
      console.error( this.userRegisterForm.status , this.userRegisterForm.invalid );
    }
}
