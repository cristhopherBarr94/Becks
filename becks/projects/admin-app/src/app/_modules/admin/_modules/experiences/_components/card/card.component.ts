import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'exp-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  public experiencesAct: any = [1,2,3];
  public experiencesInv: any = [1,2,3,1,2];
  private expSubs: Subscription;
  constructor(private router: Router,
    ) { 
     
    // this.experiences = this.expService.getActualExps();
    // this.expSubs = this.expService.exp$.subscribe(exps => {
    //   if ( exps && exps.length > 0 ) {
    //     this.experiences = exps;
    //   }
    // });
    // this.expService.getData();
  }

  ngOnInit() {}

}
