import {Component, OnInit} from '@angular/core';
import {Task} from "../models/task";
import {Project} from '../models/project';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {User} from "../models/user";
import {TaskService} from "../services/task.service";
import {ProjectService} from "../services/project.service";
import {UserService} from "../services/user.service";
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import * as moment from "moment";
import {ToastService} from "../_services/toast.service";

@Component({
  selector: 'app-tasksdetail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {

  isProjectSelected: boolean = false;
  task: Task;
  currentUser: any;
  users: User[];
  selectedProj: Project | null;
  projects: Project[] = [];
  tasks: Task[] = [];
  isLoading: boolean;
  currentPercentage: number;
  invalidTime: boolean;
  current_date = moment(new Date()).format("YYYY-MM-DD");
  form = this.formBuilder.group(
    {
      begin_date: ['', []],
      begin_hour: ['', []],
      end_date: ['', []],
      end_hour: ['', []],
      percentage: [0, [Validators.required]],
    }
  );

  submitted = false;


  constructor(private taskService: TaskService,
              private userService: UserService,
              private route: ActivatedRoute,
              private projectService: ProjectService,
              private formBuilder: FormBuilder,
              public toastService: ToastService
  ) {
    this.isLoading = true;
    this.selectedProj = null;
    this.task = {_id: "1", name: "", priority: "", percentage: 0, project: ""};
    this.isProjectSelected = false;
    this.users = [];
    this.currentPercentage = 0;
    this.invalidTime = false;
  }


  ngOnInit(): void {

    this.getTask();
    this.taskService.Refreshrequired.subscribe(response => {
      this.getTask();

    })
    this.getProjects();
    this.getTasks();
  }

  readableDate(date: any): any {
    return moment(date).format("YYYY-MM-DD");
  }

  readableHour(date: any): any {
    return moment(date).format("HH:mm");
  }

  onSubmit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    let info;
    this.submitted = true;


    if (this.checkAllTimesEmpty()) {
      info = {
        percentage: this.form.value.percentage
      }
    } else {

      if (this.canIMakeSchedule()) {

        if (this.checkOnlyBeginTime()) {
          let begin_date_with_hour =
            new Date(new Date(this.form.value.begin_date).setHours(
              this.form.value.begin_hour.split(":")[0],
              this.form.value.begin_hour.split(":")[1]))

          info = {
            begin_date: begin_date_with_hour,
            percentage: this.form.value.percentage
          }
        } else {
          if (this.form.invalid || !this.checkTimeAreNotValid()) {
            return;
          }
          let begin_date_with_hour =
            new Date(new Date(this.form.value.begin_date).setHours(
              this.form.value.begin_hour.split(":")[0],
              this.form.value.begin_hour.split(":")[1]))

          let end_date_with_hour =
            new Date(new Date(this.form.value.end_date).setHours(
              this.form.value.end_hour.split(":")[0],
              this.form.value.end_hour.split(":")[1]))

          info = {
            begin_date: begin_date_with_hour,
            end_date: end_date_with_hour,
            percentage: this.form.value.percentage
          }
        }
      } else {
        this.toastService.show(`Error, you cant schedule because already exists an urgent task at the moment`, {
          classname: 'bg-danger text-light',
          delay: 1500,
          autohide: true,
          headertext: 'Error, cant schedule'
        });
        return;
      }

    }

    this.taskService.updateInfoTask(info, id).subscribe();

    this.toastService.show(`The task was been updated successfully`, {
      classname: 'bg-primary text-light',
      delay: 1500,
      autohide: true,
      headertext: 'Updated successfully'
    });
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  checkAllTimesEmpty(): boolean {
    return this.form.value.begin_date == false && this.form.value.begin_hour == false &&
      this.form.value.end_date == false && this.form.value.end_hour == false;
  }

  canIMakeSchedule(): boolean {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].percentage < 100 && this.tasks[i].priority == "Urgent" && this.tasks[i]._id != this.task._id) {
        return false
      }
    }
    return true;

  }


  checkOnlyBeginTime(): boolean {

    return this.form.value.begin_date != false && this.form.value.begin_hour != false &&
      this.form.value.end_date == false && this.form.value.end_hour == false;
  }


  checkTimeAreNotValid(): boolean {
    let begin_date_with_hour =
      new Date(new Date(this.form.value.begin_date).setHours(
        this.form.value.begin_hour.split(":")[0],
        this.form.value.begin_hour.split(":")[1]))

    let end_date_with_hour =
      new Date(new Date(this.form.value.end_date).setHours(
        this.form.value.end_hour.split(":")[0],
        this.form.value.end_hour.split(":")[1]))
    if (begin_date_with_hour > end_date_with_hour) {
      this.invalidTime = true;
      return false
    }
    this.invalidTime = false;
    return true
  }


  updateUsers()
    :
    void {
    this.users = [];
    this.task!.assignedUsers!.forEach(user => this.userService.getUser(String(user))
      .subscribe(userWithName => this.users?.push({_id: userWithName._id, name: userWithName.name})));
  }

  getTask(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.taskService.getTask(id)
      .subscribe(async task => {
        this.task = task;

        this.form.setValue({
          begin_date: task.begin_date != null && this.readableDate(task.begin_date),
          begin_hour: task.begin_date != null && this.readableHour(task.begin_date),
          end_date: task.end_date != null && this.readableDate(task.end_date),
          end_hour: task.end_date != null && this.readableHour(task.end_date),
          percentage: task.percentage,
        });

        if (this.task.project != null) {
          this.getProject(this.task.project)
        }
        this.updateUsers();

        this.verifyProjectSelected();
      });
  }

  getTasks(): void {
    let user: any = localStorage.getItem('user');
    this.currentUser = JSON.parse(user);

    this.taskService.getTasks(this.currentUser!._id).subscribe((allTasks) => {
      this.tasks = allTasks;
    });
  }

  verifyProjectSelected()
    :
    void {
    this.isProjectSelected = this.task.project != null;
  }

  getProjects()
    :
    void {
    this.projectService.getProjects().subscribe(projects => this.projects = projects);
  }

  getProject(projectId
               :
               string
  ):
    void {
    this.projectService.getProject(projectId)
      .subscribe(newProject => {
        this.selectedProj = newProject;
      });
  }


  closeLoading()
    :
    void {
    this.isLoading = false;
  }


  selectOption()
    :
    void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.taskService.addProjectTask(this.selectedProj, id).subscribe((task) => {
      this.getProject(task.project);
    });
  }

  cleanOption()
    :
    void {
    this.isProjectSelected = false;
    this.selectedProj = null
    this.taskService.removeProjectTask(this.task).subscribe();
  }

  removeUserToTask(user
                     :
                     any
  ):
    void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.taskService.removeUserToTask(user._id, id)
      .subscribe(task => {
      });
  }

  addUserToTask = (args: any): void => {
    if (!args) {
      return;
    }
    const id = this.route.snapshot.paramMap.get('id')!;
    this.taskService.addUserToTask(args, id)
      .subscribe(task => {
      });
  }

  onChangeRange() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.taskService.updatePercentageTask(this.currentPercentage, id)
      .subscribe();
  }

  get f()
    :
    {
      [key
        :
        string
        ]:
        AbstractControl
    } {
    return this.form.controls;
  }
}
