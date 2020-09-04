import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-section-principal-img',
  templateUrl: './section-principal-img.component.html',
  styleUrls: ['./section-principal-img.component.scss'],
})
export class SectionPrincipalImgComponent implements OnInit {
  @Input() principalContent;

  constructor() { }

  ngOnInit() {}

  public scrollToElement(){
    const y = document.getElementById('formSection').offsetTop;
    console.log(y);
    this.principalContent.scrollToPoint(0, y);
  }

}
