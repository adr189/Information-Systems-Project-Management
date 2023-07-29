import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {first} from "rxjs/operators";
import {AuthenticationService} from "../_services";
import {delay, filter} from "rxjs";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatSidenav} from "@angular/material/sidenav";

@Component({
  selector: 'app-sidebar-regular',
  templateUrl: './sidebar-regular.component.html',
  styleUrls: ['./sidebar-regular.component.css']
})
export class SidebarRegularComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;


  constructor(private _router: Router,
              private authenticationService: AuthenticationService
    , private observer: BreakpointObserver) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });


  }

  navigateLogOut() {
    this._router.navigateByUrl('/login');
  }

  navigateHome() {
    this._router.navigateByUrl('/');
  }

  logout() {
    this.authenticationService.logout();
    this.navigateLogOut();
  }

}
