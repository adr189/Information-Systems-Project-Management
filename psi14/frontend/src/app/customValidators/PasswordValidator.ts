import {
  FormControl,
} from '@angular/forms';

export function validatePassword(c: FormControl) {
  let lowerCaseValidate = /([a-z])/.test(c.value);
  let upperCaseValidate = /([A-Z])/.test(c.value);
  let digitValidate = /(\d)/.test(c.value);

  return lowerCaseValidate && upperCaseValidate && digitValidate ? null : {
    password: {
      lower: {
        invalid: !lowerCaseValidate
      },
      upper: {
        invalid: !upperCaseValidate
      },
      digit: {
        invalid: !digitValidate
      }
    }

  }
}
