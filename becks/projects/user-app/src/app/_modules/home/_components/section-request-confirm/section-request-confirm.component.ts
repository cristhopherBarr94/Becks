import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { HeaderComponent } from "src/app/_modules/utils/_components/header/header.component";
import { HttpService } from "src/app/_services/http.service";
import { UiService } from "src/app/_services/ui.service";

@Component({
  selector: "user-section-request-confirm",
  templateUrl: "./section-request-confirm.component.html",
  styleUrls: ["./section-request-confirm.component.scss"],
})
export class SectionRequestConfirmComponent implements OnInit, AfterViewInit {
  @ViewChild(HeaderComponent) header: HeaderComponent;
  prevUrl: string = "/home";
  constructor(
    public httpService: HttpService,
    private ui: UiService
  ) {}

  ngOnInit() {
    this.ui.dismissLoading();
  }
  ngAfterViewInit(): void {
    this.header.urlComponent = this.prevUrl;
  }
}
