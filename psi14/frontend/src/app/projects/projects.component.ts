import {Component, OnInit} from '@angular/core';
import {Project} from '../models/project';
import {ProjectService} from '../services/project.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {ProjectAcronymValidator} from "../customValidators/ProjectAcronymValidator";


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];

  current_date = moment(new Date()).format('YYYY-MM-DD');

  form = this.formBuilder.group(
    {
      name: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern("[a-zA-Zà-úÀ-Ú0-9]+$")
      ]
      ],
      acronym: ['', [
        Validators.required,
        Validators.pattern("^[a-zA-Zà-úÀ-Ú0-9]{3}$")
      ],
        [ProjectAcronymValidator.projectAcronymValidator(this.projectService)]
      ],
      begin_date: [this.current_date, Validators.required],
      end_date: ['']
    }
  );
  submitted = false;

  constructor(
    private projectService: ProjectService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.getProjects();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.createProject();
    this.form.setValue({name: "", acronym: "", begin_date: this.current_date, end_date: ""})
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)!.setErrors(null);
    });

  }

  createProject(): void {
    this.projectService.createProject(this.form.value.name, this.form.value.acronym, this.form.value.begin_date, this.form.value.end_date)
      .subscribe(project => this.projects.push(project));
  }

  getProjects(): void {
    this.projectService.getProjects().subscribe(
      projects => this.projects = projects
    );
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

}
