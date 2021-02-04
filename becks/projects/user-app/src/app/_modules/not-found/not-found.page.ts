import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { UiService } from 'src/app/_services/ui.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
})
export class NotFoundPage implements OnInit, AfterViewInit {

  constructor(  private router: Router,
                private authSvc: AuthService,
                private ui: UiService) { }

  ngOnInit() {
    this.ui.showLoading();
  }

  ngAfterViewInit(): void {
    this.ui.dismissLoading(5000);
  }

  redir() {
    if ( this.authSvc.isAuthenticated() ) {
      this.router.navigate(["user/exp"], { queryParamsHandling: "preserve" });
    } else {
      this.router.navigate(["home"], { queryParamsHandling: "preserve" });
    }
  }
}
