import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/User';
import { UiService } from 'src/app/_services/ui.service';
import { UserService } from 'src/app/_services/user.service';
import * as moment from 'moment';

@Component({
  selector: 'user-announcer-days',
  templateUrl: './announcer-days.component.html',
  styleUrls: ['./announcer-days.component.scss'],
})
export class AnnouncerDaysComponent implements OnInit, OnDestroy {
  public size: string;
  public remaining_days:any =0;
  public isActive:boolean = false;
  public date_til : any;
  public used_date : any;
  public user: User;
  public colorProgress: string;
  public progress: any = 0;
  public daysR:any;
  public httpError: string;
  private userSubscribe: Subscription;
  private subsCodes: Subscription;
  
  constructor(    private platform: Platform, private ui: UiService, private userSvc: UserService) { 
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
      // console.log(this.size);
    });
  }

 
  ngOnInit(): void {
    this.userSubscribe = this.userSvc.user$.subscribe(user =>{
      this.user = user;
    });
    
    this.subsCodes = this.userSvc.userCodes$.subscribe(
      ( codes ) => {
        if ( codes && codes.length>0 ) {
          this.isActive = true;
          this.date_til = moment(new Date(codes[0].valid_until * 1000));
          let cur_date = moment(new Date);
          this.daysR =  this.date_til.diff(cur_date, 'days');
          this.progress = (this.daysR+0.8)* (10 / 3);
          this.remaining_days =  (this.date_til.diff(cur_date, 'days')+1);
          if(this.remaining_days>30){
            this.remaining_days=30;
          }
          if(this.progress == 0){
            this.colorProgress = "#FF0C3E";
          }
          if (this.progress <= 25) {
            this.colorProgress = "#FF7A00";
          } else if (this.progress > 25 && this.progress <= 50) {
            this.colorProgress = "#FF7A00";
          } else if (this.progress > 50 && this.progress <= 75) {
            this.colorProgress = "#00B379";
          } else if (this.progress > 75) {
            this.colorProgress = "#038259";
          }
          if (this.progress < 0) {
            this.progress = 0;
          }
       
          if ( codes.length >0 ) {
            this.httpError=" ";
            return this.daysR;
          }
        } else {}
      },
      (err) => {
        this.httpError = "Usuario inactivo";
      }
    );
    
    this.userSvc.getCodes(true);
    // this.userSvc.getCodes();
  }
  
  ngOnDestroy(): void {
    this.userSubscribe.unsubscribe();
    this.subsCodes.unsubscribe();
  }
}
