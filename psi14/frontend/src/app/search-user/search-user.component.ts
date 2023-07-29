import {Component, Input, OnInit} from '@angular/core';

import {Observable, Subject} from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import {User} from '../models/user';
import {UserService} from '../services/user.service';
import {TeamService} from "../services/team.service";
import {ActivatedRoute} from "@angular/router";
import {FormControl} from "@angular/forms";
import {TaskService} from "../services/task.service";

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.css']
})
export class SearchUserComponent implements OnInit {
  users$!: Observable<User[]>;
  newUser: string;
  currentUserId!: string;
  private searchTerms = new Subject<string>();

  @Input() callbackFunction!: ((args: any) => void);


  constructor(private userService: UserService) {
    this.newUser = "";

  }

  saveCurrentUser(currentUserId: string) {
    this.currentUserId = currentUserId;
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }


  ngOnInit(): void {
    this.users$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.userService.searchUsers(term)),
    );
  }
}
