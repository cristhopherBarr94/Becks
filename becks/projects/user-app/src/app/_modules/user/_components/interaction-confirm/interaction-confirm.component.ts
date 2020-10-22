import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MockExperiencias } from 'src/app/_mocks/experiencias-mock';
import { HeaderComponent } from 'src/app/_modules/utils/_components/header/header.component';
import { HttpService } from 'src/app/_services/http.service';

@Component({
  selector: 'user-interaction-confirm',
  templateUrl: './interaction-confirm.component.html',
  styleUrls: ['./interaction-confirm.component.scss'],
})
export class InteractionConfirmComponent implements OnInit, AfterViewInit {
  @ViewChild(HeaderComponent) header: HeaderComponent;
  prevUrl: string = "/user/profile";
  public experience:any = MockExperiencias;
  public bgExp:string;
  public id: number;
  public expTitleC:string;

  constructor(   public httpService: HttpService,
    private router: Router,) { }
  ngOnInit() {
    this.id = Number(this.router.url.replace("/user/confirm-interaction/",""))
    this.experience.forEach(exp => {
      if(this.id == exp.id){
        this.bgExp = exp.imagesExp;
        this.expTitleC = exp.titleExp; 
      }
    });

  }
  
  ngAfterViewInit(): void {
    this.header.urlComponent = this.prevUrl;
  }
}
