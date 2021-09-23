import { ActivatedRouteSnapshot, CanActivate, UrlTree } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfigComponent } from './config.component';
import { Injectable } from '@angular/core';
import { toJson } from '../utils/cast';
import { Observable } from 'rxjs';

@Injectable()
export class ConfigGuard implements CanActivate {
  constructor(readonly dialog: MatDialog) { }

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | boolean {
    let audio: null | string | Partial<MediaDeviceInfo> =
      localStorage.getItem('audio');
    let video: null | string | Partial<MediaDeviceInfo> =
      localStorage.getItem('video');

    if (audio) {
      const { deviceId } = toJson<MediaDeviceInfo>(audio as string);
      audio = { deviceId };
    }
    if (video) {
      const { deviceId } = toJson<MediaDeviceInfo>(video as string);
      video = { deviceId };
    }

    if (!audio && !video) {
      return this.openConfiguration(route);
    }

    return true;
  }

  openConfiguration(route: ActivatedRouteSnapshot) {
    return this.dialog
      .open(ConfigComponent, {
        data: route.paramMap.get('meet'),
        closeOnNavigation: false,
        disableClose: true,
      })
      .afterClosed();
  }
}
