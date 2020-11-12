import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from 'src/app/_modules/utils/_components/sidebar/sidebar.component';

@Component({
  selector: 'waiting-activation',
  templateUrl: './activation.page.html',
  styleUrls: ['./activation.page.scss'],
})
export class ActivationPage implements OnInit {
  @ViewChild(SidebarComponent) sidebar: SidebarComponent;
  constructor(  ) { }

  ngOnInit() {

  }
  ngAfterViewInit(): void {
    this.sidebar.hgtSide = 783;
    
  }
}
