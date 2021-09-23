import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { uuid } from '../utils/uuid';

@Component({
  selector: 'webrtc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form = this._fb.group({
    nickname: ['', Validators.required],
    meet: ['', Validators.required],
  });
  
  constructor(
    private _fb: FormBuilder,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.form.patchValue({ meet: uuid() });
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      const { meet } = this.form.value
      this._router.navigate(['/', 'meet', meet], this.form.value)
    }
  }
}
