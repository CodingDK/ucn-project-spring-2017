import { FormControl, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

export function isDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    const notValid = !(moment(value).isValid());
    return notValid ? { 'isDateValidator': { value } } : null;
  };
}

/**
 * Validator for checking if a date is later than another controls value
 * @param control The control used as base control
 * @param relatedControl The control to compare with
 */
export function isDateLaterValidator(control:FormControl, relatedControl: FormControl): ValidatorFn {
  return (group: FormGroup): { [key: string]: any } | null => {
    const value = moment(control.value);
    const relatedValue = moment(relatedControl.value);
    const notValid = (value.isValid()) &&
      (relatedValue.isValid()) &&
      !(value.isAfter(relatedValue));
    if (notValid) {
      control.setErrors({ 'isDateLater': true })
    }
    return null;
  }
}