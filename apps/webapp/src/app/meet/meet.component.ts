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

    console.log(peer);
    
    const { meet } = this.route.snapshot.params;
    if (meet) this.meet = meet;
    else this.meet = '';
  }

  ngOnInit(): void {
    this.peer.connect(this.meet);
  }

  end() {
    this.peer.close();
    this._router.navigate(['/']);
  }
}