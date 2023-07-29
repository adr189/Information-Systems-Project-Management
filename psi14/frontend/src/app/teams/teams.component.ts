import {Component, NgModule, OnInit} from '@angular/core';

import {Team} from '../models/team';
import {TeamService} from '../services/team.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {TeamNameValidator} from "../customValidators/TeamNameValidator";


@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
})
export class TeamsComponent implements OnInit {

  teams: Team[] = [];

  form = this.formBuilder.group(
    {
      name: ['',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern("[a-zA-Zà-úÀ-Ú0-9]+$"),
        ],
        [
          TeamNameValidator.teamNameValidator(this.teamService)
        ]
      ]
    }
  );

  submitted = false;

  constructor(private teamService: TeamService,
              private formBuilder: FormBuilder,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getTeams();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.addTeam(this.form.value);
    this.form.reset();
    Object.keys( this.form.controls).forEach(key => {
      this.form.get(key)!.setErrors(null) ;
    });
  }


  getTeams(): void {
    this.teamService
      .getTeams()
      .subscribe(teams => this.teams = teams);
  }

  addTeam(newTeam: any): void {
    newTeam.name = newTeam.name.trim();
    if (!newTeam.name) {
      return;
    }

    this.teamService
      .addTeam({name: newTeam.name} as Team)
      .subscribe(team => {
        this.teams.push(team);
      });
  }

  navigateToDetails(id: string): void {
    this.router.navigate([`team/${id}/details`]);

  }
}
