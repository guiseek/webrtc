import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';



@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: HomeComponent
        },
        {
          path: 'meet',
          loadChildren: () =>
            import('./meet/meet.module').then((m) => m.MeetModule),
        },
      ],
      { useHash: true, initialNavigation: 'enabledBlocking' }
    )
  ]
})
export class AppRoutingModule { }
