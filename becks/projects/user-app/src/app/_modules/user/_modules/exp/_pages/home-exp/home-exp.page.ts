import { Component, OnInit } from '@angular/core';
import { MenuStatusService } from 'src/app/_services/menu-status.service';

@Component({
  selector: 'user-home-exp',
  templateUrl: './home-exp.page.html',
  styleUrls: ['./home-exp.page.scss'],
})
export class HomeExpPage implements OnInit {

  constructor(private menuS : MenuStatusService,) { }

  ngOnInit() { this.menuS.statusMenu("exp") }

}
