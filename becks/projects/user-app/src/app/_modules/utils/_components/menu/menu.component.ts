import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'user-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public menuStatus:boolean = false

  constructor(private userSvc: UserService) { }

  ngOnInit() {}
  openClose(){
    this.menuStatus = !this.menuStatus
    this.userSvc.dropdownMenu(this.menuStatus)
  }
}
