import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { toJson, toText } from '../utils/cast';
import { someOneSelectedValidator } from './utils/some-one-selected.validator';

@Component({
  selector: 'webrtc-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  private _audio = new BehaviorSubject<MediaDeviceInfo[]>([]);
  public audio$ = this._audio.asObservable();

  private _video = new BehaviorSubject<MediaDeviceInfo[]>([]);
  public video$ = this._video.asObservable();

  deviceState = new FormGroup({
    audio: new FormControl(true),
    video: new FormControl(true),
  });

  deviceConfig = new FormGroup(
    {
      audio: new FormControl(''),
      video: new FormControl(''),
    },
    {
      validators: someOneSelectedValidator,
    }
  );

  streamConfig: {
    audio: MediaStream | null;
    video: MediaStream | null;
  } = {
    audio: null,
    video: null,
  };

  ngOnInit(): void {
    let audio = localStorage.getItem('audio');
    let video = localStorage.getItem('video');
    if (audio) audio = toJson(audio);
    if (video) video = toJson(video);

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      this._audio.next(devices.filter((d) => d.kind === 'audioinput'));
      this._video.next(devices.filter((d) => d.kind === 'videoinput'));

      this.deviceConfig.patchValue({ audio, video });
    });
  }

  compareWith(o1: MediaDeviceInfo, o2: MediaDeviceInfo) {
    return o1 && o2 && o1.deviceId === o2.deviceId;
  }

  async onAudioChange(config: MediaDeviceInfo) {
    if (!config) {
      localStorage.removeItem('audio');
      this.streamConfig.audio = null;
      return;
    }
    const devices = navigator.mediaDevices;
    const audio = { deviceId: config.deviceId };
    const stream = await devices.getUserMedia({ audio });
    localStorage.setItem('audio', toText(config.toJSON()));
    this.streamConfig.audio = stream;
  }

  async onVideoChange(config: MediaDeviceInfo) {
    if (!config) {
      localStorage.removeItem('video');
      this.streamConfig.video = null;
      return;
    }
    const devices = navigator.mediaDevices;
    const video = { deviceId: config.deviceId };
    const stream = await devices.getUserMedia({ video });
    localStorage.setItem('video', toText(config.toJSON()));
    this.streamConfig.video = stream;
  }
}
