import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'user-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  openMenu = false;
  closeMenu = false;

  constructor() { }

  ngOnInit() {}

  abrirMenu() {
    this.openMenu = !this.openMenu;
    this.closeMenu = !this.closeMenu;
  }

}
