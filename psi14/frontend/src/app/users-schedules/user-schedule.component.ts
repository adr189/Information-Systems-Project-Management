import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-users-schedules',
  templateUrl: './user-schedule.component.html',
  styleUrls: ['./user-schedule.component.css']
})
export class UsersSchedulesComponent implements OnInit {

  users: User[] = []

  constructor(private userService: UserService,
              private router: Router ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  navigateToSchedule(id: string): void {
    this.router.navigate([`user/${id}/schedule`]);
  }
}
