import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TeamDetailComponent} from './team-detail/team-detail.component';
import {SidebarAdminComponent} from './sidebar-admin/sidebar-admin.component';
import {LoginComponent} from './login/login.component';
import {NgSimpleSidebarModule} from 'ng-simple-sidebar';
import {SidebarRegularComponent} from './sidebar-regular/sidebar-regular.component';
import {HomepageComponent} from './homepage/homepage.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ProjectsComponent} from './projects/projects.component';
import {UsersComponent} from './users/users.component';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';


import {TasksComponent} from './tasks/tasks.component';
import {TeamsComponent} from './teams/teams.component';
import {SearchUserComponent} from './search-user/search-user.component';
import {TaskDetailComponent} from './task-detail/task-detail.component';
import {CommonModule} from "@angular/common";
import {ContextModule} from "./context/context.module";
import {A11yModule} from "@angular/cdk/a11y";
import {ScheduleComponent} from "./schedule/schedule.component";
import {FocusDirective} from "./_helpers/focusOnInit";
import {MyToastComponent} from "./myToast/myToast.component";
import {SearchTeamComponent} from "./search-team/search-team.component";
import {AmazingTimePickerModule} from "amazing-time-picker";
import {TeamScheduleDetailComponent} from "./team-schedule-detail/team-schedule-detail.component";
import {TeamSchedulesComponent} from "./teams-schedules/team-schedule.component";
import {UsersSchedulesComponent} from "./users-schedules/user-schedule.component";
import {UserScheduleDetailComponent} from "./user-schedule-detail/user-schedule-detail.component";

@NgModule({
    imports: [
        NgSimpleSidebarModule,
        BrowserAnimationsModule,
        NgbModule,
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        CommonModule,
        ContextModule,
        A11yModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        AmazingTimePickerModule
    ],
  declarations: [
    AppComponent,
    ProjectsComponent,
    UsersComponent,
    TeamDetailComponent,
    SidebarAdminComponent,
    LoginComponent,
    SidebarRegularComponent,
    HomepageComponent,
    SearchUserComponent,
    TaskDetailComponent,
    TasksComponent,
    TeamsComponent,
    ScheduleComponent,
    FocusDirective,
    MyToastComponent,
    SearchTeamComponent,
    TeamSchedulesComponent,
    TeamScheduleDetailComponent,
    UsersSchedulesComponent,
    UserScheduleDetailComponent
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
