import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, Routes } from '@angular/router';

import { MeetComponent } from './meet.component';
import { MeetGuard } from './meet.guard';


const routes: Routes = [
  { path: ':meet', component: MeetComponent, canActivate: [MeetGuard] }
];

@NgModule({
  declarations: [
    MeetComponent,
  ],
  imports: [
    CommonModule,
    LayoutModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule.forChild(routes)
  ],
  providers: [MeetGuard]
})
export class MeetModule { }