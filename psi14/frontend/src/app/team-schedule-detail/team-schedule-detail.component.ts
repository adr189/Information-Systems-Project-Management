import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CalendarView, CalendarEvent} from 'angular-calendar';
import {ConsumerComponent} from '../context/context-consumer.component';
import {Project} from '../models/project';
import {Team} from '../models/team';
import {User} from '../models/user';
import {Task} from '../models/task';
import {ProjectService} from '../services/project.service';
import {TaskService} from '../services/task.service';
import {TeamService} from '../services/team.service';
import {UserService} from '../services/user.service';
import * as moment from "moment";

@Component({
  selector: 'app-team-schedule-detail',
  templateUrl: './team-schedule-detail.component.html',
  styleUrls: ['./team-schedule-detail.component.css']
})
export class TeamScheduleDetailComponent implements OnInit {

  team: Team;
  users: User[];
  tasks: Task[] = [];
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  projects: Project[] = [];
  dateDetails: any;
  eventsDetails: any;

  events: CalendarEvent[] = []


  constructor(private taskService: TaskService,
              private teamService: TeamService,
              private projectService: ProjectService,
              private userService: UserService,
              private route: ActivatedRoute,
              public consumerComponent: ConsumerComponent) {
    this.users = [];
    this.team = {_id: "1", name: "", users: [], project: ""}
  }

  ngOnInit(): void {

    this.getAllInformation();

    this.sleep(500).then(value => {

      for (let i = 0; i < this.users.length; i++) {
        this.userService.getMeetingsFromUser(this.users[i]._id).subscribe(
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

    })
  }

  getAllInformation = async () => {
    await this.getTeamDetails();
    await this.sleep(300)
    await this.getTasksFromTeam();
    await this.sleep(300)
  }


  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  getTeamDetails(): Promise<void> {
    return new Promise(async (resolve) => {

      const id = this.route.snapshot.paramMap.get('id')!;
      this.teamService.getTeam(id)
        .subscribe(team => {
          this.team = team;
          this.updateUsers();
        });
      this.getProjects();
      resolve();
    })
  }

  getProjects(): void {
    this.projectService.getAvailableProjects().subscribe(projects => this.projects = projects);
  }


  updateUsers(): void {
    this.users = [];
    this.team?.users.forEach(user => this.userService.getUser(String(user))
      .subscribe(userWithName => {
        this.users?.push({_id: userWithName._id, name: userWithName.name})
      }));
  }


  getTasksFromTeam(): Promise<void> {
    return new Promise(async (resolve) => {

      for (let i = 0; i < this.users.length; i++) {
        this.taskService
          .getTasks(this.users[i]._id)
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
      }


      resolve();
    });
  }

  filterTasks(task: Task): boolean {
    var f = false;
    this.projects.forEach(p => f = task.project === p._id)
    return f
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {

    this.dateDetails = date;
    this.eventsDetails = events;
    this.showDayDetails();


  }

  showDayDetails(): void {
    // Simulate click function
    let click_event = new CustomEvent('click');
    let btn_element = document.querySelector('.hiddenButton');
    btn_element!.dispatchEvent(click_event);

  }

  setView(view: CalendarView) {
    this.view = view;
  }

  readableDate(date: any): any {
    return moment(date).format("YYYY-MM-DD");
  }

  readableHour(date: any): any {
    return moment(date).format("HH:mm");
  }
}
