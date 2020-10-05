import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { AuthService } from "src/app/_services/auth.service";
import { HttpService } from "src/app/_services/http.service";
import { UiService } from "src/app/_services/ui.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "user-name-tittle",
  templateUrl: "./name-tittle.component.html",
  styleUrls: ["./name-tittle.component.scss"],
})
export class NameTittleComponent implements OnInit {
  @Input() first_name: string;
  public size: string;

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private platform: Platform,
    private ui: UiService,
    private uiService: UiService,
    private router: Router
  ) {
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
    });
  }

  ngOnInit() {}

  logout() {
    this.uiService.showLoading();
    this.authService.setAuthenticated("");
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
  }
}
