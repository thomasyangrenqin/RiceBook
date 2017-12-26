import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators,ValidationErrors } from '@angular/forms';

// used for birthdate validation
export function birthdateValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const today = new Date();
    const birth = new Date(control.value);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
       		age--;
	}
    return age < 18 ? {'Birthdate': {value: control.value}} : null;
  };
}

@Directive({
  selector: '[Birthdate]',
  providers: [{provide: NG_VALIDATORS, useExisting: BirthdateDirective, multi: true}]
})
export class BirthdateDirective implements Validator{

  constructor() { }
  validate(control: AbstractControl): {[key: string]: any} {
    return birthdateValidator()(control);
  }

}
