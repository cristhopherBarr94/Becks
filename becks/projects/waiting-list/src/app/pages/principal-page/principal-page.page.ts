import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../model/User';
import { UserService } from '../../services/user.service';

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
          this.router.navigate(['age-gate'], { queryParamsHandling: "preserve" });
        }
      }
    }
}
