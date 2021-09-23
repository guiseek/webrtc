import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const someOneSelectedValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const audio = control.get('audio');
  const video = control.get('video');

  const someOne = !audio?.value && !video?.value;
  return someOne ? { someOneSelected: true } : null;
};
