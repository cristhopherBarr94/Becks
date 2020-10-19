import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/_modules/utils/_components/header/header.component';
import { HttpService } from 'src/app/_services/http.service';
import { UiService } from 'src/app/_services/ui.service';

@Component({
  selector: 'user-interaction-view',
  templateUrl: './interaction-view.component.html',
  styleUrls: ['./interaction-view.component.scss'],
})
export class InteractionViewComponent implements OnInit , AfterViewInit {
  @ViewChild(HeaderComponent) header: HeaderComponent;
  prevUrl: string = "/home";
  constructor(
    public httpService: HttpService,
  ) {}

  ngOnInit() {}
  ngAfterViewInit(): void {
    this.header.urlComponent = this.prevUrl;
  }
}
