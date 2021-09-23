import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Signaling, SignalingEvent, SignalMessage, Socket } from '@webrtc/ports';
import { Observable } from 'rxjs';

import { ConfigComponent } from '../config/config.component';

@Injectable({
  providedIn: 'root',
})
export class MeetGuard implements CanActivate {
  constructor(
    readonly router: Router,
    readonly dialog: MatDialog,
    private _signaling: Signaling<Socket>
  ) {}

  canActivate({
    params,
  }: ActivatedRouteSnapshot): boolean | Observable<boolean> {
    /* if the meet is wrong, return */
    if (typeof params.meet !== 'string') {
      return false;
    }

    /* ask if there is anyone in the meeting room */
    const payload: Pick<SignalMessage, 'meet'> = { meet: params.meet };

    const full$ = new Observable<boolean>((subscribe) => {
      /* listening to availability response */
      this._signaling.on(SignalingEvent.Available, (message) => {
        if (message) {
          console.log(message);
          subscribe.next(!!message);
        }
      });
    });

    this._signaling.emit(SignalingEvent.KnockKnock, payload);

    return full$;
  }

  openAlert(route: ActivatedRouteSnapshot) {
    return this.dialog
      .open(ConfigComponent, {
        data: route.paramMap.get('meet'),
        closeOnNavigation: false,
        disableClose: true,
      })
      .afterClosed();
  }
}