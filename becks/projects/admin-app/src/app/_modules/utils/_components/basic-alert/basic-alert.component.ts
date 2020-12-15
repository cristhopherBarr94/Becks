import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'user-basic-alert',
  templateUrl: './basic-alert.component.html',
  styleUrls: ['./basic-alert.component.scss'],
})
export class BasicAlertComponent implements OnInit {
  @Input() title;
  @Input() description;

  constructor() { }

  ngOnInit() {}

}
