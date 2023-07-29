import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {TeamDetailComponent} from "./team-detail/team-detail.component";
import {LoginComponent} from "./login/login.component"
import {AuthGuard} from "./_helpers";
import {Role} from "./_models";
import {HomepageComponent} from "./homepage/homepage.component";
import {ProjectsComponent} from "./projects/projects.component";
import {UsersComponent} from "./users/users.component";
import {TeamsComponent} from './teams/teams.component';
import {TasksComponent} from './tasks/tasks.component';
import {TaskDetailComponent} from "./task-detail/task-detail.component";
import {ScheduleComponent} from "./schedule/schedule.component";
import {TeamSchedulesComponent} from "./teams-schedules/team-schedule.component";
import {TeamScheduleDetailComponent} from "./team-schedule-detail/team-schedule-detail.component";
import {UsersSchedulesComponent} from "./users-schedules/user-schedule.component";
import {UserScheduleDetailComponent} from "./user-schedule-detail/user-schedule-detail.component";


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomepageComponent,

  },
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Admin]}
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Admin]}
  },
  {
    path: 'teams',
    component: TeamsComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Admin]}
  },

  {
    path: 'team/:id/details',
    component: TeamDetailComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Admin]}
  },
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Regular]}
  },
  {
    path: 'task/:id/details',
    component: TaskDetailComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Regular]}
  },
  {
    path: 'schedule',
    component: ScheduleComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Regular]}
  },
  {
    path: 'teams/schedules',
    component: TeamSchedulesComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Regular]}
  },
  {
    path: 'team/:id/schedule',
    component: TeamScheduleDetailComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Regular]}
  },
  {
    path: 'users/schedule',
    component: UsersSchedulesComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Regular]}
  },
  {
    path: 'user/:id/schedule',
    component: UserScheduleDetailComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Regular]}
  },


  {
    path: 'login',
    component: LoginComponent
  },

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];


@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule {
}
