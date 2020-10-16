import { Component, Input, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/User';
import { LogOutComponent } from 'src/app/_modules/user/_modules/profile/_components/log-out/log-out.component';
import { AuthService } from 'src/app/_services/auth.service';
import { HttpService } from 'src/app/_services/http.service';
import { MenuStatusService } from 'src/app/_services/menu-status.service';
import { UiService } from 'src/app/_services/ui.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'user-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Input() urlImage: string;
  @Input() default_photo: boolean;
  @Input() transparent: boolean = false;
  public menuStatus:boolean = false;
  public url: string = environment.serverUrl;
  public gender:string
  public time;
  private pictureSub: Subscription;
  private menuOption : string
  userSubscription: Subscription;
  menuSubscription: Subscription

  constructor(private userSvc: UserService,   private authService: AuthService,
    private httpService: HttpService,
    private ui: UiService,
    private router: Router,
    private menuS : MenuStatusService,
    ) { this.pictureSub = this.userSvc.editing$.subscribe((isEditing) => {
      this.time = isEditing
        ? ""
        : "?time_stamp=" + Math.floor(Date.now() / 1000);
    }); 
    this.userSubscription = this.menuS.menuStatus$.subscribe(
      (result)=>{ this.menuOption = result}    
    )       
  }

  ngOnInit() {
    if(this.urlImage == undefined){      
      this.userSvc.getData();
      this.userSubscription = this.userSvc.user$.subscribe(
        (user: User) => {
          if (user !== undefined) {           
            this.urlImage = user.photo;
            this.default_photo = !!!user.photo;
            this.gender = user.gender;
          }
        },
        (error: any) => {}
      );      
    }
  }
  

  ngOnDestroy() {
    this.pictureSub.unsubscribe();
  }

  ngAfterViewInit() {
    this.time = "?time_stamp=" + Math.floor(Date.now() / 1000);    
  }

  openClose(){
    this.menuStatus = !this.menuStatus
    this.userSvc.dropdownMenu(this.menuStatus)
  }

  logout() {    
      this.ui.showModal(
        LogOutComponent,
        "pop-up-profile-picture",
        true,
        true
      ); 
      console.log('salir')       
  }

  transparentStyle(){
    if(this.transparent){
     return "position-menu-absolute"
    }
  }

  profilePicture() {
    return this.default_photo
      ? this.gender == "F"
        ? "../../../../../assets/img/profile_female.jpg"
        : "../../../../../assets/img/profile_male.jpg"
      : this.url + this.urlImage+ this.time ;
  }

  selected(seccion:string){
    if(seccion == this.menuOption){
      return "border-green"
    }
  }
}
