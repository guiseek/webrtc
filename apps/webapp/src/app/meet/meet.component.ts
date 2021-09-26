import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Peer } from '@webrtc/ports';


@Component({
  selector: 'webrtc-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss']
})
export class MeetComponent implements OnInit {
  meet: string;

  constructor(
    readonly route: ActivatedRoute,
    private _router: Router,
    readonly peer: Peer
  ) {
    const { meet } = this.route.snapshot.params;
    if (meet) this.meet = meet;
    else this.meet = '';

    this.peer.on('stream', console.log)
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