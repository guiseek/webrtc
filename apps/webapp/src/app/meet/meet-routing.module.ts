import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeetComponent } from './meet.component';

const routes: Routes = [{ path: ':meet', component: MeetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetRoutingModule { }