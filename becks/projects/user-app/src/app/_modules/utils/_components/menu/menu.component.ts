import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { HttpService } from 'src/app/_services/http.service';
import { UiService } from 'src/app/_services/ui.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'user-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public menuStatus:boolean = false

  constructor(private userSvc: UserService,   private authService: AuthService,
    private httpService: HttpService,
    private ui: UiService,
    private router: Router,) { }

  ngOnInit() {}
  openClose(){
    this.menuStatus = !this.menuStatus
    this.userSvc.dropdownMenu(this.menuStatus)
  }

  logout() {
    this.ui.showLoading();
    this.authService.setAuthenticated("");
    this.httpService
      .get(environment.serverUrl + environment.logout.resource)
      .subscribe(
        (r) => {
          this.ui.dismissLoading();
          this.router.navigate(["home"]);
        },
        (e) => {
          this.ui.dismissLoading();
          this.router.navigate(["home"]);
        }
      );
  }
}
