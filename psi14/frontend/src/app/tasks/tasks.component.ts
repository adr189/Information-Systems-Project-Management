import {Component, Inject, OnInit} from '@angular/core';

import {Task} from '../models/task';
import {TaskService} from '../services/task.service';
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ContextComponent} from "../context/context.component";
import {ConsumerComponent} from "../context/context-consumer.component";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];

  form = this.formBuilder.group(
    {
      name: ['',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern("[a-zA-Zà-úÀ-Ú0-9]+$")
        ]
      ],
      priority: ['Indica a prioridade',
        Validators.pattern("^Urgent|^High|^Medium|^Low")]
    }
  );

  submitted = false;


  constructor(private taskService: TaskService,
              private formBuilder: FormBuilder,
              private router: Router,
              public consumerComponent: ConsumerComponent) {
  }


  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.taskService
      .getTasks(this.consumerComponent!.consumerProvider?.value._id)
      .subscribe(tasks => this.tasks = tasks);
  }

  onSubmit(userId: string): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.addTask(this.form.value.name, this.form.value.priority, userId);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }


  addTask(name: string, priority: string, userId: string): void {
    name = name.trim();
    priority = priority.trim();
    if (!name || !priority) {
      return;
    }
    this.taskService
      .addTask({name, priority, percentage: 0, assignedUsers: [{_id: userId}]} as Task)
      .subscribe(task => {
        this.tasks.push(task);
      });
  }

  deleteTask(task: Task): void {
    this.tasks = this.tasks.filter(h => h !== task);
    this.taskService.deleteTask(task._id).subscribe();
  }

  navigateToDetails(id: string): void {
    this.router.navigate([`task/${id}/details`]);

  }

}
