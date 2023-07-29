import {
  AbstractControl,
  AsyncValidatorFn,
} from '@angular/forms';
import {map} from 'rxjs/operators';
import {TeamService} from "../services/team.service";

export class TeamNameValidator {
  static teamNameValidator(teamService: TeamService): AsyncValidatorFn {
    return (control: AbstractControl): any => {
      return teamService
        .existsTeamWithName(control.value)
        .pipe(
          map((result: boolean) =>
            result ? {unique: true} : null
          )
        );
    };
  }
}
