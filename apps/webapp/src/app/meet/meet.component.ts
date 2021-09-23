import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { drawOscilloscope } from '@webrtc/adapters';
import { Peer } from '@webrtc/ports';



@Component({
  selector: 'webrtc-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss'],
})
export class MeetComponent implements OnInit, AfterViewInit {
  meet: string;
  
  @ViewChild('audioCanvas')
  audioCanvasRef!: ElementRef<HTMLCanvasElement>;
  audioCanvas!: HTMLCanvasElement;
  
  recorder!: MediaRecorder | null;

  constructor(
    readonly route: ActivatedRoute,
    private _router: Router,
    readonly peer: Peer
  ) {
    const { meet } = this.route.snapshot.params;
    if (meet) this.meet = meet;
    else this.meet = '';
  }

  ngOnInit(): void {
    this.peer.connect(this.meet);
  }

  ngAfterViewInit(): void {
    this.audioCanvas = this.audioCanvasRef.nativeElement;
    this.peer.on('stream', (stream) => this.draw(stream));
  }

  async draw(stream: MediaStream) {
    if (this.audioCanvas) {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);

      const analyser = audioCtx.createAnalyser();

      const style = { fill: '#fff', stroke: '#00bb77' };
      // drawOscilloscope(this.audioCanvas, analyser, style);

      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
  }

  record(stream: MediaStream) {
    if (!this.recorder || this.recorder?.state === 'inactive') {
      this.recorder = new MediaRecorder(stream);
      const blobs: Blob[] = [];
      this.recorder.ondataavailable = ({ data }) => {
        blobs.push(data);
      };
      this.recorder.onstop = () => {
        const blob = new Blob(blobs, { type: 'video/webm' });
        const link = document.createElement('a');
        link.download = new Date().toDateString() + '.webm';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      };

      this.recorder.start();
    } else {
      this.recorder.stop();
      this.recorder = null;
    }
  }

  end() {
    this.peer.close();
    this._router.navigate(['/']);
  }
}