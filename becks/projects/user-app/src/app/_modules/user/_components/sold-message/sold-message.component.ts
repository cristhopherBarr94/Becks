import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/_services/ui.service';

@Component({
  selector: 'user-sold-message',
  templateUrl: './sold-message.component.html',
  styleUrls: ['./sold-message.component.scss'],
})
export class SoldMessageComponent implements OnInit {

  constructor(private ui: UiService,) { }

  ngOnInit() {}

  close() {
    this.ui.dismissModal();
  }
}
