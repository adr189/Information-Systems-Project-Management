import {Component, Input, OnInit} from '@angular/core';

import {Observable, Subject} from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';


import {TeamService} from "../services/team.service";
import {Team} from "../models/team";

@Component({
  selector: 'app-search-team',
  templateUrl: './search-team.component.html',
  styleUrls: ['./search-team.component.css']
})
export class SearchTeamComponent implements OnInit {
  teams$!: Observable<Team[]>;
  newTeam: string;
  currentTeam!: Team;
  private searchTerms = new Subject<string>();

  @Input() callbackFunction!: ((args: any) => void);


  constructor(private teamService: TeamService) {
    this.newTeam = "";

  }

  saveCurrentTeam(team: Team) {
    this.currentTeam = team;
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }


  ngOnInit(): void {
    this.teams$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.teamService.searchTeams(term)),
    );
  }
}
