import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ExperienciasService } from "src/app/_services/experiencias.service";
import { HttpService } from "src/app/_services/http.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-terms-conditions",
  templateUrl: "./terms-conditions.page.html",
  styleUrls: ["./terms-conditions.page.scss"],
})
export class TermsConditionsPage implements OnInit {
  private expSubs: Subscription;
  public terms_exp = [];
  public goblalUrl;
  constructor(
    private expService: ExperienciasService,
    private httpService: HttpService
  ) {
    this.expSubs = this.expService.exp$.subscribe((exps) => {
      if (exps && exps.length > 0) {
        this.terms_exp = exps;
      }
    });
    this.expService.getData();
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.expSubs.unsubscribe();
  }
}
