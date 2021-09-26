import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Peer } from '@webrtc/ports';


@Component({
  selector: 'webrtc-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss']
})
export class MeetComponent implements OnInit {
  meet: string;

  private _progress = new BehaviorSubject<number>(0);
  public progress$ = this._progress.asObservable();

  constructor(
    readonly route: ActivatedRoute,
    private _router: Router,
    readonly peer: Peer
  ) {
    const { meet } = this.route.snapshot.params;
    if (meet) this.meet = meet;
    else this.meet = '';

    this.peer.on('stream', console.log)
    this.peer.on('progress', (progress) => {
      console.log(progress);
      const { percent } = progress
      this._progress.next(percent);
    })
  }

  ngOnInit(): void {
    this.peer.on('track', console.log)
    this.peer.connect(this.meet);
    this.peer.on('track', console.log)
  }

  end() {
    this.peer.close();

    this._router.navigate(['/']);
  }
}