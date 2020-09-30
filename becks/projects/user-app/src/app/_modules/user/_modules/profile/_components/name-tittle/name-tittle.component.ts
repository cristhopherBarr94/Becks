import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
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

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private uiService: UiService,
    private router: Router
  ) {}

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
