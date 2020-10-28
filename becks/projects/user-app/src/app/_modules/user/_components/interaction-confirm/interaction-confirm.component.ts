import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { MockExperiencias } from 'src/app/_mocks/experiencias-mock';
import { HeaderComponent } from 'src/app/_modules/utils/_components/header/header.component';
import { HttpService } from 'src/app/_services/http.service';
import { UiService } from 'src/app/_services/ui.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { User } from 'src/app/_models/User';

declare global {
  interface Window {
    dataLayer: any[];
  }
}
@Component({
  selector: 'user-interaction-confirm',
  templateUrl: './interaction-confirm.component.html',
  styleUrls: ['./interaction-confirm.component.scss'],
})
export class InteractionConfirmComponent implements OnInit, AfterViewInit {
  @ViewChild(HeaderComponent) header: HeaderComponent;
  prevUrl: string = "/user/exp";
  public experience:any = MockExperiencias;
  public userRegisterForm: FormGroup;
  public userRegister: User= new User();
  public httpError: string;
  public bgExpDes:string;
  public bgExpMob:string;
  public id: number;
  public expTitleC:string;
  public expLocation:string;
  public expDescRed:string;
  public size: string;
  public allow:boolean=false;


  constructor(   
    public httpService: HttpService,
    private router: Router, 
    private platform: Platform,
    private ui: UiService,
    private formBuilder: FormBuilder,) { 

      platform.ready().then(() => {
        this.platform.resize.subscribe(() => {
          this.size = this.ui.getSizeType(platform.width());
        });
        this.size = this.ui.getSizeType(platform.width());
      });
    }
  ngOnInit() {
    this.id = Number(this.router.url.replace("/user/confirm-interaction/",""))
    this.experience.forEach(exp => {
      console.log(this.size);
      if(this.id == exp.id){
        this.bgExpMob = exp.imagesExpMob;
        this.bgExpDes = exp.imagesExp;
        this.expTitleC = exp.titleExp; 
        this.expLocation = exp.placeExp;
        this.expDescRed = "Enviaremos a tu correo las instrucciones para vivir esta experiencia.";
        this.allow=true;
      }
    });
    this.initforms();
  }
  
  ngAfterViewInit(): void {
    this.header.urlComponent = this.prevUrl;
  }

  initforms() {
    this.userRegisterForm = this.formBuilder.group({
      privacy: new FormControl(null, Validators.required),
    });
  }
  redempExp() {
    if ( this.userRegisterForm.invalid) {
      (<any>Object).values(this.userRegisterForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
  }
}
