import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators,ValidationErrors } from '@angular/forms';

// used for password validation
export function PasswordCheckValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
  	const password = (<HTMLInputElement>document.getElementById("password"));
    const flag = password.value != control.value;
    return flag ? {'PasswordCheck': {value: control.value}} : null;
  };
}

@Directive({
  selector: '[PasswordCheck]',
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordDirective, multi: true}]
})
export class PasswordDirective implements Validator{

  constructor() { }
  validate(control: AbstractControl): {[key: string]: any} {
    return PasswordCheckValidator()(control);
  }
}
