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
            name: new FormControl('', Validators.required),
            surname: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            telephone: new FormControl('', Validators.required),
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
}
