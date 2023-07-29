import {
  AbstractControl,
  AsyncValidatorFn,
} from '@angular/forms';
import {map} from 'rxjs/operators';
import {ProjectService} from "../services/project.service";

export class ProjectAcronymValidator {
  static projectAcronymValidator(projectService: ProjectService): AsyncValidatorFn {
    return (control: AbstractControl): any => {
      return projectService
        .existsProjectWithAcronym(control.value)
        .pipe(
          map((result: boolean) =>
            result ? {unique: true} : null
          )
        );
    };
  }
}
