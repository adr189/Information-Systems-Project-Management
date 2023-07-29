import {Component, OnInit} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import * as moment from 'moment';
import {Meeting} from '../models/meeting';
import {ActivatedRoute} from '@angular/router';
import {TaskService} from '../services/task.service';
import {Task} from '../models/task';
import {UserService} from '../services/user.service';
import {User} from "../models/user";

@Component({
  selector: 'app-user-schedule-detail',
  templateUrl: './user-schedule-detail.component.html',
  styleUrls: ['./user-schedule-detail.component.css']
})
export class UserScheduleDetailComponent implements OnInit {

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  current_date = moment(new Date()).format('YYYY-MM-DD');

  userTasks: Task[] = [];
  userMeetings: Meeting[] = [];
  events: CalendarEvent[] = [];
  dateDetails: any;
  eventsDetails: any;
  user: User | undefined;


  constructor(private taskService: TaskService,
              private userService: UserService,
              private route: ActivatedRoute
  ) {

  }


  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    this.userService.getUser(id).subscribe(value => this.user = value)
    this.sleep(400).then(() => this.getAllInformation());
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {

    this.dateDetails = date;
    this.eventsDetails = events;
    this.showDayDetails();

  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showDayDetails(): void {
    // Simulate click function
    let click_event = new CustomEvent('click');
    let btn_element = document.querySelector('.hiddenButton');
    btn_element!.dispatchEvent(click_event);

  }

  readableDate(date: any): any {
    return moment(date).format("YYYY-MM-DD");
  }

  readableHour(date: any): any {
    return moment(date).format("HH:mm");
  }

  getAllInformation() {
    this.taskService
      .getTasks(this.user!._id)
      .subscribe(tasks => {
        for (let task of tasks) {
          if (task.begin_date != undefined && task.end_date != undefined) {
            this.events = [
              ...this.events,
              {
                start: new Date(task.begin_date),
                end: new Date(task.end_date),
                title: `Name: ${task.name} | Percentage: ${task.percentage}`,
                id: "TASK",
              }
            ]
          }
        }
      });
    this.userService.getMeetingsFromUser(this.user!._id).subscribe(
      value => {
        for (let x of value) {
          this.events = [
            ...this.events,
            {
              start: new Date(x.begin),
              end: new Date(x.end),
              title: String(x.type),
              id: String(x.type)
            }
          ]
        }
      });

  }
}
