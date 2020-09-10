import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from '../../model/User';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal-page',
  templateUrl: './principal-page.page.html',
  styleUrls: ['./principal-page.page.scss'],
})
export class PrincipalPagePage implements OnInit {

  public userRegisterForm: FormGroup;

  public userRegister: User = new User();

  @ViewChild('principalContent') principalContent;

  constructor(private formBuilder: FormBuilder,
              public userService: UserService,
              private router: Router) { }

    ngOnInit() {

      if (!localStorage.getItem('age-gate-local')) {
        if(!sessionStorage.getItem('age-gate-session')) {
          this.router.navigate(['age-gate']);
        }
      }
      // this.initforms();
    }

    // initforms(){
    //   this.userRegisterForm = this.formBuilder.group({
    //         name: new FormControl('', Validators.required),
    //         surname: new FormControl('', Validators.required),
    //         email: new FormControl('', [Validators.required, Validators.email]),
    //         telephone: new FormControl('', Validators.required),
    //         gender: new FormControl(null, Validators.required),
    //         captcha: new FormControl(null, Validators.required)
    //       });
    // }

    // saveUser(): void {
    //   this.userService.setCreationUser(this.userRegister).subscribe(
    //     (data: any) => {
    //       this.userRegisterForm.reset();
    //       this.router.navigate(['confirm-register']);
    //     },
    //     err => {}
    //   );
    // }
}
