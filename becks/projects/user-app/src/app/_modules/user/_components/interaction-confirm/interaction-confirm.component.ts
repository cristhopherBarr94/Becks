import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
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
import { ExperienciasService } from 'src/app/_services/experiencias.service';

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
  public experience:any = [];
  public userRegisterForm: FormGroup;
  public userRegister: User= new User();
  public httpError: string;
  public bgExp:string;
  public id: number;
  public expTitleC:string;
  public expLocation:string;
  public expDescRed:string;
  public size: string;


  constructor(   
    public httpService: HttpService,
    private router: Router, 
    private platform: Platform,
    private ui: UiService,
    private formBuilder: FormBuilder,
    private expService: ExperienciasService) { 
      platform.ready().then(() => {
        this.platform.resize.subscribe(() => {
          this.size = this.ui.getSizeType(platform.width());
        });
        this.size = this.ui.getSizeType(platform.width());
      });
      this.id = Number(this.router.url.replace("/user/confirm-interaction/",""));
      this.experience = this.expService.exp$.subscribe(exps => {
        if ( exps && exps.length > 0 ) {
        this.experience = exps;
        }
       this.experience.forEach(exp => {
        if(this.id == exp.id){
          this.expTitleC = exp.titleExp; 
          this.expLocation = exp.placeExp;
          this.expDescRed = "Enviaremos a tu correo las instrucciones para vivir esta experiencia.";
          if(this.size == 'sm' || this.size == 'xs'){
            this.getImgExp("mob");
          }else {
            this.getImgExp("desk");
          }
        }
      });
      });

    this.expService.getData();

    }
  ngOnInit() {
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
    console.log("click");
  }
  getImgExp(sz:string) {
    this.experience.forEach(expImg => 
      { 
        if(this.id == expImg.id) {

          if(sz=="mob"){
            this.bgExp = expImg.imagesExpMob;

          }else if(sz=="desk") {
            this.bgExp = expImg.imagesExp;
          }
        }
      }
      );
  }
}
