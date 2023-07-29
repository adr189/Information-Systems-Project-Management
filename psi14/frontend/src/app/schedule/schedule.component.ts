import {Component, OnInit} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import * as moment from "moment";
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {durationValidator} from "../customValidators/DurationValidator";
import {ToastService} from "../_services/toast.service";
import {Meeting, MEETING_TYPE} from "../models/meeting";
import {User} from "../models/user";
import {TeamService} from "../services/team.service";
import {Team} from "../models/team";

@Component({
  selector: 'app-homepage',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  current_date = moment(new Date()).format('YYYY-MM-DD');
  isLoading: boolean;
  availableMeetingsForUsers: Meeting[]
  notAvailableMeetingsForUsers: Meeting[]
  currentMeetingOptionForUsers: Meeting | null;

  availableMeetingsForTeams: Meeting[]
  notAvailableMeetingsForTeams: Meeting[]
  currentMeetingOptionForTeams: Meeting | null;

  users: User[];
  teams: Team[];

  formForUsers = this.formBuilder.group(
    {
      duration: [30, [Validators.required, durationValidator]],
      begin_date: [this.current_date, Validators.required],
      end_date: ['', Validators.required],
      users: ['', Validators.required]
    }
  );

  formForTeams = this.formBuilder.group(
    {
      duration: [30, [Validators.required, durationValidator]],
      begin_date: [this.current_date, Validators.required],
      end_date: ['', Validators.required],
      team: ['', Validators.required]
    }
  );

  formForOccupied = this.formBuilder.group(
    {
      date: [this.current_date, Validators.required],
      begin_hour: ['', Validators.required],
      end_hour: ['', [Validators.required]],
    }
  );
  invalidTimeOccupied: boolean;

  events: CalendarEvent[] = []
  dateDetails: any;
  eventsDetails: any;

  submittedForUser = false;
  submittedForTeam = false;
  submittedForOccupied = false;
  currentUser: User;


  constructor(private formBuilder: FormBuilder,
              private usersService: UserService,
              public toastService: ToastService,
              public teamService: TeamService) {
    this.users = [];
    this.teams = [];
    this.isLoading = false;
    this.availableMeetingsForUsers = [];
    this.notAvailableMeetingsForUsers = [];
    this.currentMeetingOptionForUsers = null;

    this.availableMeetingsForTeams = [];
    this.notAvailableMeetingsForTeams = [];
    this.currentMeetingOptionForTeams = null;

    this.invalidTimeOccupied = false;

    let user: any = localStorage.getItem('user');
    this.currentUser = JSON.parse(user);
    this.usersService.getMeetingsFromUser(this.currentUser._id).subscribe(
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


  ngOnInit(): void {
  }


  addUser = (args: any): void => {
    this.usersService.getUser(args).subscribe(value => {
      if (this.users.find(value1 => value1._id === value._id) == undefined) {
        this.users.push(value);
      }
    })
    this.formForUsers.setValue({
      duration: this.formForUsers.value.duration, begin_date: this.formForUsers.value.begin_date,
      end_date: this.formForUsers.value.end_date, users: args
    })
  }

  addTeam = (args: any): void => {
    this.teams = [];
    this.teams.push(args)
    this.formForTeams.setValue({
      duration: this.formForTeams.value.duration, begin_date: this.formForTeams.value.begin_date,
      end_date: this.formForTeams.value.end_date, team: args._id
    })
  }

  removeUser(user: any): void {
    const index = this.users.indexOf(user);
    this.users.splice(index, 1);
    if (this.users.length == 0) {
      this.formForUsers.setValue({
        duration: this.formForUsers.value.duration, begin_date: this.formForUsers.value.begin_date,
        end_date: this.formForUsers.value.end_date, users: ''
      })
    }
  }

  removeTeam(): void {
    console.log(this.teams)
    this.teams = [];
    this.formForTeams.setValue({
      duration: this.formForTeams.value.duration, begin_date: this.formForTeams.value.begin_date,
      end_date: this.formForTeams.value.end_date, team: ''
    })
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  getAvailableOptionsForUser(): void {
    this.submittedForUser = true;
    console.log(this.formForUsers)

    if (this.formForUsers.invalid) {
      return;
    }
    this.isLoading = true;
    this.closeFormForUser()
    this.updateNotAvailableMeetingForUser();
    this.sleep(500).then(() => {
      this.isLoading = false
      this.openFormPickScheduleForUser()
      this.fillFormPickScheduleForUser();
    });

  }

  getAvailableOptionsForTeam(): void {
    this.submittedForTeam = true;

    if (this.formForTeams.invalid) {
      return;
    }
    this.isLoading = true;
    this.closeFormForTeam()
    this.updateNotAvailableMeetingForTeam();
    this.sleep(500).then(() => {
      this.isLoading = false
      this.openFormPickScheduleForTeam()
      this.fillFormPickScheduleForTeam();

    });

  }


  updateNotAvailableMeetingForUser(): void {
    for (let i = 0; i < this.users.length; i++) {
      this.usersService
        .getMeetingsFromUser(this.users[i]._id)
        .subscribe(value => this.notAvailableMeetingsForUsers = this.notAvailableMeetingsForUsers.concat(value))
    }
  }

  updateNotAvailableMeetingForTeam(): void {

    if (this.teams == null || this.teams == [] || this.teams[0].users == null) {
      return;
    }
    for (let i = 0; i < this.teams[0].users.length; i++) {

      let id: any = this.teams[0].users[i];
      this.usersService
        .getMeetingsFromUser(id)
        .subscribe(value => this.notAvailableMeetingsForTeams = this.notAvailableMeetingsForTeams.concat(value))
    }
  }

  fillFormPickScheduleForUser(): void {

    const hoursForDay = 8;
    const OneHourToMinutes = 60;


    let currentDate: Date = new Date(this.formForUsers.value.begin_date);
    let endDate = new Date(this.formForUsers.value.end_date);
    let days = (endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
    let possibleMeetings = (hoursForDay * (OneHourToMinutes / this.formForUsers.value.duration));
    currentDate.setHours(9, 30)


    for (let i = 0; i <= days; i++) {

      for (let i = 0; i < possibleMeetings; i++) {

        let temp = new Date(currentDate);
        let end = new Date(currentDate.setMinutes(currentDate.getMinutes() + this.formForUsers.value.duration))
        let newMeeting: Meeting = {
          begin: temp,
          end: end,
        }

        if (this.isValidMeetingForUsers(newMeeting) && this.isNotWeekend(newMeeting)) {
          this.availableMeetingsForUsers.push(newMeeting)
        }

      }
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(9, 30);
    }

  }

  fillFormPickScheduleForTeam(): void {

    const hoursForDay = 8;
    const OneHourToMinutes = 60;

    let currentDate: Date = new Date(this.formForTeams.value.begin_date);
    let endDate = new Date(this.formForTeams.value.end_date);
    let days = (endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
    let possibleMeetings = (hoursForDay * (OneHourToMinutes / this.formForTeams.value.duration));
    currentDate.setHours(9, 30)


    for (let i = 0; i <= days; i++) {

      for (let i = 0; i < possibleMeetings; i++) {

        let temp = new Date(currentDate);
        let end = new Date(currentDate.setMinutes(currentDate.getMinutes() + this.formForTeams.value.duration))
        let newMeeting: Meeting = {
          begin: temp,
          end: end,
        }

        if (this.isValidMeetingForTeams(newMeeting) && this.isNotWeekend(newMeeting)) {
          this.availableMeetingsForTeams.push(newMeeting)
        }

      }
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(9, 30);
    }

  }


  isNotWeekend(newMeeting: Meeting): boolean {
    if (newMeeting.begin.getDay() == 6 || newMeeting.end.getDay() == 6 || newMeeting.begin.getDay() == 0
      || newMeeting.end.getDay() == 0) {
      return false
    }
    return true;
  }


  isValidMeetingForUsers(newMeeting: Meeting): boolean {
    let response = true;
    this.notAvailableMeetingsForUsers.map(meeting => {

      if (!((newMeeting.begin <= new Date(meeting.begin) && newMeeting.end <= new Date(meeting.begin)) ||
        (newMeeting.begin >= new Date(meeting.end) && newMeeting.end >= new Date(meeting.end))
      )) {
        response = false;
      }

    })

    return response;

  }

  isValidMeetingForTeams(newMeeting: Meeting): boolean {
    let response = true;
    this.notAvailableMeetingsForTeams.map(meeting => {

      if (!((newMeeting.begin <= new Date(meeting.begin) && newMeeting.end <= new Date(meeting.begin)) ||
        (newMeeting.begin >= new Date(meeting.end) && newMeeting.end >= new Date(meeting.end))
      )) {
        response = false;
      }

    })

    return response;

  }


  onSubmitForUser(): void {
    this.submittedForUser = true;
    if (this.formForUsers.invalid || this.currentMeetingOptionForUsers == null) {
      return;
    }

    this.currentMeetingOptionForUsers.users = this.users;
    this.currentMeetingOptionForUsers.type = MEETING_TYPE.USER;

    for (let i = 0; i < this.users.length; i++) {
      this.usersService.addMeetingToUser(this.users[i]._id, this.currentMeetingOptionForUsers).subscribe()
    }

    document.getElementsByClassName("btn-close-user")[0]!.dispatchEvent(new CustomEvent('click'));

    if (this.users.find(value => value._id == this.currentUser._id) !== undefined) {
      this.events = [
        ...this.events,
        {
          start: new Date(this.currentMeetingOptionForUsers.begin),
          end: new Date(this.currentMeetingOptionForUsers.end),
          title: MEETING_TYPE.USER,
          id: MEETING_TYPE.USER
        }
      ]
    }

    this.resetFormForUser()
    this.toastService.show(`The new meeting for day ${this.currentMeetingOptionForUsers.begin.getDate()} added successfully`, {
      classname: 'bg-primary text-light',
      delay: 5000,
      autohide: true,
      headertext: 'Meeting Added'
    });
  }


  onSubmitForTeam(): void {
    this.submittedForTeam = true;
    if (this.formForTeams.invalid || this.currentMeetingOptionForTeams == null) {
      return;
    }

    this.currentMeetingOptionForTeams.users = this.teams[0].users;
    this.currentMeetingOptionForTeams.type = MEETING_TYPE.TEAM;

    for (let i = 0; i < this.teams[0].users.length; i++) {
      let id: any = this.teams[0].users[i];
      this.usersService.addMeetingToUser(id, this.currentMeetingOptionForTeams).subscribe()
    }

    document.getElementsByClassName("btn-close-team")[0]!.dispatchEvent(new CustomEvent('click'));

    if (this.teams[0].users.find((value: any) => value == this.currentUser._id) !== undefined) {
      this.events = [
        ...this.events,
        {
          start: new Date(this.currentMeetingOptionForTeams.begin),
          end: new Date(this.currentMeetingOptionForTeams.end),
          title: MEETING_TYPE.TEAM,
          id: MEETING_TYPE.TEAM
        }
      ]
    }

    this.resetFormForTeam()
    this.toastService.show(`The new meeting for day ${this.currentMeetingOptionForTeams.begin.getDate()} added successfully`, {
      classname: 'bg-primary text-light',
      delay: 5000,
      autohide: true,
      headertext: 'Meeting Added'
    });
  }

  checkHoursAreValid(): boolean {
    console.log(this.fForOccupied.end_hour)
    let begin_hour = this.formForOccupied.value.begin_hour.split(":")[0]
    let begin_minute = this.formForOccupied.value.begin_hour.split(":")[1]

    let end_hour = this.formForOccupied.value.end_hour.split(":")[0]
    let end_minute = this.formForOccupied.value.end_hour.split(":")[1]


    let begin = new Date(new Date(this.formForOccupied.value.date)
      .setHours(begin_hour, begin_minute));

    let end = new Date(new Date(this.formForOccupied.value.date)
      .setHours(end_hour, end_minute));

    if (begin > end) {
      this.invalidTimeOccupied = true;
      return false
    }
    this.invalidTimeOccupied = false;
    return true
  }

  onSubmitForOccupied(): void {
    this.submittedForOccupied = true;
    if (this.formForOccupied.invalid || !this.checkHoursAreValid()) {
      return;
    }

    let time = new Date(this.formForOccupied.value.date);
    console.log(time)


    let begin_hour = this.formForOccupied.value.begin_hour.split(":")[0]
    let begin_minute = this.formForOccupied.value.begin_hour.split(":")[1]

    let end_hour = this.formForOccupied.value.end_hour.split(":")[0]
    let end_minute = this.formForOccupied.value.end_hour.split(":")[1]


    let begin = new Date(new Date(this.formForOccupied.value.date)
      .setHours(begin_hour, begin_minute));

    let end = new Date(new Date(this.formForOccupied.value.date)
      .setHours(end_hour, end_minute));

    let currentMeetingOptionForOccupied: Meeting = {
      begin: begin,
      end: end,
      type: MEETING_TYPE.OCCUPIED,
      users: [this.currentUser]
    }

    this.usersService.addMeetingToUser(this.currentUser._id, currentMeetingOptionForOccupied).subscribe()

    document.getElementsByClassName("btn-close-occupied")[0]!.dispatchEvent(new CustomEvent('click'));

    this.events = [
      ...this.events,
      {
        start: new Date(begin),
        end: new Date(end),
        title: MEETING_TYPE.OCCUPIED,
        id: MEETING_TYPE.OCCUPIED
      }
    ]

    this.toastService.show(`The new occupied period for day ${begin.getDate()} added successfully`, {
      classname: 'bg-primary text-light',
      delay: 5000,
      autohide: true,
      headertext: 'Meeting Added'
    });
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {

    this.dateDetails = date;
    this.eventsDetails = events;
    this.showDayDetails();

  }

  selectOptionMeetingForUser(meeting: Meeting, index: number): void {
    document.getElementsByClassName("list-group-item active")[0]?.classList.remove("active");
    document.getElementById(`meeting${index}user`)!.classList.add("active")

    this.currentMeetingOptionForUsers = meeting;
  }

  selectOptionMeetingForTeam(meeting: Meeting, index: number): void {
    document.getElementsByClassName("list-group-item active")[0]?.classList.remove("active");
    document.getElementById(`meeting${index}team`)!.classList.add("active")

    this.currentMeetingOptionForTeams = meeting;
  }

  resetFormForUser(): void {
    document.querySelector(".optionsAvailability")!.setAttribute('style', 'display:flex');
    document.querySelector(".optionsAvailability2")!.setAttribute('style', 'display:none');
    document.querySelector(".header2")!.setAttribute('style', 'display:none');
    this.availableMeetingsForUsers = [];
    this.notAvailableMeetingsForUsers = [];
    this.users = [];
    this.users.push(this.currentUser);
  }

  resetFormForTeam(): void {
    document.querySelector(".optionsAvailabilityTeam")!.setAttribute('style', 'display:flex');
    document.querySelector(".optionsAvailabilityTeam2")!.setAttribute('style', 'display:none');
    document.querySelector(".headerTeam2")!.setAttribute('style', 'display:none');
    this.availableMeetingsForTeams = [];
    this.notAvailableMeetingsForTeams = [];
  }

  closeFormForUser(): void {
    document.querySelector(".optionsAvailability")!.setAttribute('style', 'display:none');
  }

  closeFormForTeam(): void {
    document.querySelector(".optionsAvailabilityTeam")!.setAttribute('style', 'display:none');
  }

  openFormPickScheduleForUser(): void {
    document.querySelector(".optionsAvailability2")!.setAttribute('style', 'display:flex!important');
    document.querySelector(".header2")!.setAttribute('style', 'display:flex!important');
  }

  openFormPickScheduleForTeam(): void {
    document.querySelector(".optionsAvailabilityTeam2")!.setAttribute('style', 'display:flex!important');
    document.querySelector(".headerTeam2")!.setAttribute('style', 'display:flex!important');
  }


  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  get fForUsers(): { [key: string]: AbstractControl } {
    return this.formForUsers.controls;
  }

  get fForTeams(): { [key: string]: AbstractControl } {
    return this.formForTeams.controls;
  }

  get fForOccupied(): { [key: string]: AbstractControl } {
    return this.formForOccupied.controls;
  }


  showRightMenuCreateMeetingWithUser(): void {
    // Simulate click function
    let click_event = new CustomEvent('click');
    let btn_element = document.querySelector('.value1dropdown');
    btn_element!.dispatchEvent(click_event);

  }

  showRightMenuCreateMeetingWithTeams(): void {
    // Simulate click function
    let click_event = new CustomEvent('click');
    let btn_element = document.querySelector('.value1dropdownTeam');
    btn_element!.dispatchEvent(click_event);

  }

  showRightMenuCreateOccupied(): void {
    // Simulate click function
    let click_event = new CustomEvent('click');
    let btn_element = document.querySelector('.value1dropdownOccupied');
    btn_element!.dispatchEvent(click_event);

  }

  showDayDetails(): void {
    // Simulate click function
    let click_event = new CustomEvent('click');
    let btn_element = document.querySelector('.hiddenButton');
    btn_element!.dispatchEvent(click_event);

  }


  formatDate(dateReceived: Date) {
    let date = new Date(dateReceived);
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  readableDate(date: any): any {
    return moment(date).format("YYYY-MM-DD");
  }

  readableHour(date: any): any {
    return moment(date).format("HH:mm");
  }
}
