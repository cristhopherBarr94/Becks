import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

  constructor(  private authService: AuthService,
                private router: Router ) { }

  ngOnInit() {}

  logout() {
    this.authService.setAuthenticated('');
    this.router.navigate(['login'])
  }

}
