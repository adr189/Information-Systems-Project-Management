import {
  AbstractControl,
  AsyncValidatorFn,
} from '@angular/forms';
import {map} from 'rxjs/operators';
import {UserService} from "../services/user.service";

export class UserNameValidator {
  static userNameValidator(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl): any => {
      return userService
        .existsUserWithName(control.value)
        .pipe(
          map((result: boolean) =>
            result ? {unique: true} : null
          )
        );
    };
  }
}
