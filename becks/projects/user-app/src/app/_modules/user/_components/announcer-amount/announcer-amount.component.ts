import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'user-announcer-amount',
  templateUrl: './announcer-amount.component.html',
  styleUrls: ['./announcer-amount.component.scss'],
})
export class AnnouncerAmountComponent implements OnInit {
  @Input() stock:string;
  @Input() quantity:string;
  constructor() { }

  ngOnInit() {
   
  }

}
