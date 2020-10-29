import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'user-announcer-amount',
  templateUrl: './announcer-amount.component.html',
  styleUrls: ['./announcer-amount.component.scss'],
})
export class AnnouncerAmountComponent implements OnInit {
  @Input() state:string;
  public quantity:number=5;
  constructor() { }

  ngOnInit() {
   
  }

}
