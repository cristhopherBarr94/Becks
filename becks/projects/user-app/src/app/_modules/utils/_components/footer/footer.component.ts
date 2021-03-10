import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public year = 2020;
  @Input() log: boolean = true;

  constructor() { }

  ngOnInit() {
   
    this.year = (new Date()).getFullYear();
    

  }

}
