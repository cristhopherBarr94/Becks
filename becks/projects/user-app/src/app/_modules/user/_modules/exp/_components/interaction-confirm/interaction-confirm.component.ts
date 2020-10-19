import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from 'src/app/_modules/utils/_components/header/header.component';

@Component({
  selector: 'user-interaction-confirm',
  templateUrl: './interaction-confirm.component.html',
  styleUrls: ['./interaction-confirm.component.scss'],
})
export class InteractionConfirmComponent implements OnInit, AfterViewInit {
  @ViewChild(HeaderComponent) header: HeaderComponent;
  prevUrl: string = "/user/profile";

  constructor() { }

  ngOnInit() {}
  
  ngAfterViewInit(): void {
    this.header.urlComponent = this.prevUrl;
  }
}
