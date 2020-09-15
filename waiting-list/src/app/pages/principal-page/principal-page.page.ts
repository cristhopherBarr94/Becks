import { AfterViewChecked, AfterViewInit, Component, DoCheck, OnInit, ViewChild } from '@angular/core';
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

  constructor(public userService: UserService,
              private router: Router) { }

    ngOnInit() {
      if (!localStorage.getItem('age-gate-local')) {
        if(!sessionStorage.getItem('age-gate-session')) {
          this.router.navigate(['age-gate']);
        }
      }
    }
}
