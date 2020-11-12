import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExperienciasService } from 'src/app/_services/experiencias.service';

@Component({
  selector: 'exp-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit, OnDestroy {
  public experiencesAct: any = [];
  public experiencesInv: any = [];
  private expSubs: Subscription;
  public contentExperiences= [];
  public curDate = new Date();
  @Input() editFunc:any;
  
  constructor(private router: Router, private expService: ExperienciasService
    ) { 
     
    this.expSubs = this.expService.exp$.subscribe(exps => {
      if ( exps && exps.length > 0 ) {
          this.experiencesInv = [];
          this.experiencesAct = [];
          this.contentExperiences = exps;
           this.contentExperiences.forEach(content => {
             if (this.curDate > (new Date(content.dateEnd*1000))) {
               this.experiencesInv.push(content);
             }else {
               this.experiencesAct.push(content);
             }
           });
      }
    });
    this.expService.getData();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.expSubs.unsubscribe();
  }
   
  openEdit() {
    this.editFunc();
  }
}
