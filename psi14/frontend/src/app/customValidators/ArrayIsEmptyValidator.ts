import {
  FormControl,
} from '@angular/forms';

export function arrayIsEmptyValidator(c: FormControl) {

  console.log("validaror", c.value)
  return c.value == [] ? null : {
    isEmpty: {
      invalid: true
    }

  }
}
