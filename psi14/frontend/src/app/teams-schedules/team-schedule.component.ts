import { Component,NgModule,  OnInit } from '@angular/core';
import {Team} from '../models/team';
import {User} from '../models/user';
import {TeamService} from '../services/team.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-team-schedule',
  templateUrl: './team-schedule.component.html',
  styleUrls: ['./team-schedule.component.css']
})
export class TeamSchedulesComponent implements OnInit {

  teams: Team[] = [];
  user: User = (JSON.parse(localStorage.getItem("user") || ""));

  submitted = false;

  constructor(private teamService: TeamService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getTeams();
  }


   getTeams(): void {
     this.teamService
      .getTeamsFromUser(this.user._id)
      .subscribe(teams => this.teams = teams);
  }


  navigateToSchedule(id: string): void {
    this.router.navigate([`team/${id}/schedule`]);

  }
}
