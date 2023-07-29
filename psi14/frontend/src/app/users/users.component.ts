import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, Validators} from '@angular/forms';
import {User} from '../models/user';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../services/user.service';
import {UserNameValidator} from "../customValidators/UserNameValidator";
import {validatePassword} from "../customValidators/PasswordValidator";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  role = 'REGULAR';

  form = this.formBuilder.group(
    {
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern("[a-zA-Zà-úÀ-Ú0-9]+$"),
      ], [
        UserNameValidator.userNameValidator(this.userService)
      ]
      ],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        validatePassword,
      ]
      ]
    }
  );


  submitted = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.createUser();
    this.form.reset();
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)!.setErrors(null);
    });
  }

  createUser(): void {
    this.userService.createUser(this.form.value.name, this.form.value.password, this.role)
      .subscribe(user => this.users.push(user));

  }

  getUsers(): void {
    this.userService.getUsers().subscribe(users => this.users = users);
  }

}
