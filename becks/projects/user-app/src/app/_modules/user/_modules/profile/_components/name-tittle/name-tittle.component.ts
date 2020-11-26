import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/User';
import { AuthService } from "src/app/_services/auth.service";
import { HttpService } from "src/app/_services/http.service";
import { UiService } from "src/app/_services/ui.service";
import { UserService } from 'src/app/_services/user.service';
import { environment } from "src/environments/environment";

@Component({
  selector: "user-name-tittle",
  templateUrl: "./name-tittle.component.html",
  styleUrls: ["./name-tittle.component.scss"],
})
export class NameTittleComponent implements OnInit, OnDestroy {
  @Input() first_name: string;
  public size: string;
  public nameResponsive: any
  public visibleNAme : boolean
  private userSub: Subscription;
  public user: User;

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private platform: Platform,
    private ui: UiService,
    private uiService: UiService,
    private router: Router,
    private userSvc: UserService
  ) {
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
    });
    this.nameResponsive = this.userSvc.dropdownMenu$.subscribe((result)=>{ this.visibleNAme=result})
   
    // console.log("NameTittleComponent -> this.nameResponsive", this.nameResponsive)
  }

  ngOnInit() {
    this.userSub = this.userSvc.user$.subscribe( (user) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  logout() {
    this.uiService.showLoading();
    this.httpService
      .get(environment.serverUrl + environment.logout.resource)
      .subscribe(
        (r) => {
          this.uiService.dismissLoading();
          this.router.navigate(["home"]);
        },
        (e) => {
          this.uiService.dismissLoading();
          this.router.navigate(["home"]);
        }
      );
      this.authService.setAuthenticated("");
      this.userSvc.logout();
  }
}
