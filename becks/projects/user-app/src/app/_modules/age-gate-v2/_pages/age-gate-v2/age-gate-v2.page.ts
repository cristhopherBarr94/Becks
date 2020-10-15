import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'user-age-gate-v2',
  templateUrl: './age-gate-v2.page.html',
  styleUrls: ['./age-gate-v2.page.scss'],
})
export class AgeGateV2Page implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    if (
      localStorage.getItem("user-age-gate-local") ||
      sessionStorage.getItem("user-age-gate-session")
    ) {
      this.router.navigate(["home"], { queryParamsHandling: "preserve" });
    }
  }

}
