import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetRoutingModule } from './meet-routing.module';
import { MeetComponent } from './meet.component';

@NgModule({
  declarations: [MeetComponent],
  imports: [CommonModule, MeetRoutingModule],
})
export class MeetModule {}
