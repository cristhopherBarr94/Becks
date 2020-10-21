import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { HttpService } from 'src/app/_services/http.service';
import { UiService } from 'src/app/_services/ui.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'user-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.scss'],
})
export class LogOutComponent implements OnInit {

  constructor(
    private ui: UiService,
    private authService: AuthService,
    private router: Router,
    private userSvc: UserService,
    private httpService: HttpService,
  ) { }

  ngOnInit() {}

  logout() { 
  this.ui.showLoading();
  this.httpService
    .get(environment.serverUrl + environment.logout.resource)
    .subscribe(
      (r) => {
        this.ui.dismissLoading();
        this.ui.dismissModal()
        //this.router.navigate(["home"]);
        location.reload();
      },
      (e) => {
        this.ui.dismissLoading();
        this.ui.dismissModal()
        //this.router.navigate(["home"]);
        location.reload();
      }
    );
    this.authService.setAuthenticated("");
    this.userSvc.logout();
}

close (){
  this.ui.dismissModal()
}

}
