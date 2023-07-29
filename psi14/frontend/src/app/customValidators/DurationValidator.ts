import {
  FormControl,
} from '@angular/forms';

export function durationValidator(c: FormControl) {
  let isMultipleOf30 = c.value % 30 === 0;

  return isMultipleOf30 ? null : {
    duration: {
        invalid: !isMultipleOf30
    }

  }
}
