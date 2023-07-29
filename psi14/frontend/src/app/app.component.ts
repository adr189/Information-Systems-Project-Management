import {Component, InjectionToken, ViewChild} from '@angular/core';
import {AuthenticationService} from "./_services";
import {User} from "./models/user";
import {MatSidenav} from "@angular/material/sidenav";
import {Role} from "./_models";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  title = 'frontend';


  user!: User;


  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.user.subscribe(x => {
      this.user = x;
    });
  }


  get isAdmin() {
    return this.user && this.user.role === Role.Admin;
  }

  get isRegular() {
    return this.user && this.user.role === Role.Regular;
  }

  logout() {
    this.authenticationService.logout();
  }

}
