import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
})
export class NotFoundPage implements OnInit {

  constructor( private router: Router,
                private authSvc: AuthService) { }

  ngOnInit() {
  }

  redir() {
    if ( this.authSvc.isAuthenticated() ) {
      this.router.navigate(["user/exp"], { queryParamsHandling: "preserve" });
    } else {
      this.router.navigate(["home"], { queryParamsHandling: "preserve" });
    }
  }
}
