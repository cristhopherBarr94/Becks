import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/_services/ui.service';

@Component({
  selector: 'user-home-exp',
  templateUrl: './home-exp.page.html',
  styleUrls: ['./home-exp.page.scss'],
})
export class HomeExpPage implements OnInit {

  constructor(private ui : UiService,) { }

  ngOnInit() { 
    if (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    ) {
      this.ui.dismissLoading();
    }
  }

}
