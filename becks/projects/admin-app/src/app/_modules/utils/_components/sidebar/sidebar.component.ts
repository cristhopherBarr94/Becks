import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  @Input() hgtSide:number;

  constructor( private router: Router ) { }

  ngOnInit() {
    console.log(this.hgtSide);
  }
  
  redirectTo(target) {
    if(target == "act"){
      this.router.navigate([`admin/activation`], {
        queryParamsHandling: "preserve",
        state: { reload: 'true' }
      });
    }
    if(target == "exp"){
      this.router.navigate([`admin/exp`], {
        queryParamsHandling: "preserve",
        state: { reload: 'true' }
      });
    }
  }
}
