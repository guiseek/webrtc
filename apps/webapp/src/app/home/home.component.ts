import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export type ObjOf<T = unknown> = Record<string, T>;

export const toJson = <R>(data: string) => JSON.parse(data) as R;
export const toText = <T extends ObjOf<T[keyof T]>>(data: T) =>
  JSON.stringify(data);

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

@Component({
  selector: 'webrtc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  form = this._fb.group({
    nickname: ['', Validators.required],
    meet: ['', Validators.required],
  });

  constructor(private _fb: FormBuilder, private _router: Router) {}

  async ngOnInit() {
    this.form.patchValue({ meet: uuid() });
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      const { meet } = this.form.value;
      this._router.navigate(['/', 'meet', meet], this.form.value);
    }
  }
}
