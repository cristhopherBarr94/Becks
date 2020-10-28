

import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/User';
import { LogOutComponent } from 'src/app/_modules/user/_modules/profile/_components/log-out/log-out.component';
import { AuthService } from 'src/app/_services/auth.service';
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
  @Input() default_photo: boolean;
  @Input() transparent: boolean = false;
  public menuStatus:boolean = false;
  public url: string = environment.serverUrl;
  public time;
  public user;
  private pictureSub: Subscription;
  private menuOption : string
  private userSubscription: Subscription;
  private menuSubscription: Subscription;

  constructor(private userSvc: UserService,   private authService: AuthService,
    private ui: UiService,
    private menuS : MenuStatusService,
    ) { this.pictureSub = this.userSvc.editing$.subscribe((isEditing) => {
      this.time = isEditing
        ? ""
        : "?time_stamp=" + Math.floor(Date.now() / 1000);
    });
  }

  ngOnInit() {
    this.userSubscription = this.userSvc.user$.subscribe(
      (user: User) => {
        this.user = user;
      },
      (error: any) => {}
    ); 

    this.user = this.userSvc.getActualUser();
    if ( !this.user ) {
      this.userSvc.getData();
    }
    
    this.menuSubscription = this.menuS.menuStatus$.subscribe(
      (result)=>{
        this.menuOption = result;
      }
    );
  }
  

  ngOnDestroy() {
    this.pictureSub.unsubscribe();
    this.userSubscription.unsubscribe();
    this.menuSubscription.unsubscribe();
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
  }

  transparentStyle() {
    if(this.transparent){
     return "position-menu-absolute"
    }
  }

  selected(seccion:string){
    if(seccion == this.menuOption){
      return "border-green"
    }
  }
}
