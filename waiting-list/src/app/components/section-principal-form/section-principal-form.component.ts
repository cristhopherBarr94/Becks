import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../model/User';

@Component({
  selector: 'app-section-principal-form',
  templateUrl: './section-principal-form.component.html',
  styleUrls: ['./section-principal-form.component.scss'],
})
export class SectionPrincipalFormComponent implements OnInit {
  public userRegisterForm: FormGroup;

  public userRegister: User = new User();


  constructor(private formBuilder: FormBuilder,
              public userService: UserService,
              private router: Router) { }

    ngOnInit() {
      this.initforms();
    }

    initforms(){
      this.userRegisterForm = this.formBuilder.group({
            name: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern('[A-Za-z ]*')]),
            surname: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern('[A-Za-z ]*')]),
            email: new FormControl('', [Validators.required, Validators.email,  Validators.maxLength(30)]),
            prefix: new FormControl('', [Validators.required, Validators.maxLength(3)]),
            telephone: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]),
            gender: new FormControl(null, Validators.required)
          });
    }

    saveUser(): void {
      this.userService.setCreationUser(this.userRegister).subscribe(
        (data: any) => {
          this.userRegisterForm.reset();
          this.router.navigate(['confirm-register']);
        },
        err => {}
      );
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
      console.log(item);
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
}
