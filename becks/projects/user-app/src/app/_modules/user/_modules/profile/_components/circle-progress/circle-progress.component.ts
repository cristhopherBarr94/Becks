import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { HttpService } from 'src/app/_services/http.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { UserService } from 'src/app/_services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: "user-circle-progress",
  templateUrl: "./circle-progress.component.html",
  styleUrls: ["./circle-progress.component.scss"],
})
export class CircleProgressComponent implements OnInit, OnDestroy {
  public httpError: string;
  public remaining_days: any;
  public colorProgress: string;
  public colorProgressBar: string;
  public progress: number = 0;
  public daysR:any;
  public buttonTitle:String = "ACTIVA TU CUENTA";
  public textDays:string = "Tu cuenta se encuentra inactiva";
  private subscription: Subscription;

  
  constructor(
    public httpService: HttpService,
    private router: Router,
    private userSvc: UserService,
  ) {}

  ngOnInit() {
    this.subscription = this.userSvc.userCodes$.subscribe(
      ( codes ) => {
        if ( codes.length >0) {
          let date_til = moment(new Date(codes[0].valid_until * 1000));
          let cur_date = moment(new Date);
          this.daysR =  date_til.diff(cur_date, 'days');
          this.progress = (this.daysR+1)* (10 / 3);
          this.remaining_days = Math.ceil(this.progress * (30 / 100));
          this.buttonTitle = "OBTÉN MÁS DÍAS";
          this.textDays = "Disfruta de las nuevas experiencias";

         if (this.progress <= 25) {
            this.colorProgress = "#FF7A00";
            this.colorProgressBar =
              "linear-gradient(180deg, #E66E48 0%, #FF7A00 100%)";
          } else if (this.progress > 25 && this.progress <= 50) {
            this.colorProgress = "#FF7A00";
            this.colorProgressBar =
              "linear-gradient(180deg, #E66E48 0%, #FF7A00 100%)";
          } else if (this.progress > 50 && this.progress <= 75) {
            this.colorProgress = "#00B379";
            this.colorProgressBar =
              "linear-gradient(180deg, #038259 0%, #00B379 100%)";
          } else if (this.progress > 75) {
            this.colorProgress = "#038259";
            this.colorProgressBar =
              "linear-gradient(180deg, #038259 0%, #00B379 100%)";
          }
          if (this.progress < 0) {
            this.progress = 0;
          }
          if (this.progress == 100){
          this.buttonTitle = "VER EXPERIENCIAS";
          }
          if ( codes.length >0 ) {
            this.httpError=" ";
            return this.daysR;
          }
        }
        else {
          this.progress = 0 * (10 / 3);
          this.remaining_days = Math.ceil(this.progress * (30 / 100));
       
          if(this.progress == 0) {
            this.colorProgress = "#DB4843";
            this.colorProgressBar = "#DB4843";
          }
        }
      },
      (err) => {
        this.httpError = "Usuario inactivo";
      }
    );
    this.userSvc.getCodes();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  redirectSales() {
    this.router.navigate(["user/activation"], {
      queryParamsHandling: "preserve",
    });
  }
}
