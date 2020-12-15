import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { HeaderComponent } from 'src/app/_modules/utils/_components/header/header.component';
import { UiService } from 'src/app/_services/ui.service';
import { User } from 'src/app/_models/User';
import { ExperienciasService } from 'src/app/_services/experiencias.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'user-announcer-access-forbidden',
  templateUrl: './announcer-access-forbidden.component.html',
  styleUrls: ['./announcer-access-forbidden.component.scss'],
})
export class AnnouncerAccessForbiddenComponent implements OnInit {
  @ViewChild(HeaderComponent) header: HeaderComponent;
  prevUrl: string = "/user/exp";
  public experience:any = [];
  public bgExp:string;
  public id: number;
  public expTitleC:string;
  public expLocation:string;
  public expDescRed:string;
  public size: string;
  private expSubs: Subscription;
 
  constructor(   
    private router: Router, 
    private platform: Platform,
    private ui: UiService,
    private expService: ExperienciasService) { 
      platform.ready().then(() => {
        this.platform.resize.subscribe(() => {
          this.size = this.ui.getSizeType(platform.width());
        });
        this.size = this.ui.getSizeType(platform.width());

      this.id = Number(this.router.url.replace("/user/access-forbidden/",""));

      this.expSubs = this.expService.exp$.subscribe(exps => {
        if ( exps && exps.length > 0 ) {
        this.experience = exps;
        if(this.size == 'sm' || this.size == 'xs'){
          this.getImgExp("mob");
        }else {
          this.getImgExp("desk");
        }
        }
      });
    this.expService.getData();
      });
    }

    ngOnInit() {
      }

ngAfterViewInit(): void {
    this.header.urlComponent = this.prevUrl;
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
