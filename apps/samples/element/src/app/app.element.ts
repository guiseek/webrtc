import { injector } from './app.providers';
import { Peer } from '@webp2p/ports';

import './app.element.scss';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  meetId: string;

  peer = injector.get<Peer>(Peer);

  innerHTML = `
    <main>
      <section class="container" id="remote">
        <video autoplay playsinline></video>
      </section>
      
      <section id="local" [ngClass]="{ videoff: peer.uiState.video }">
        <video
          autoplay
          playsinline
          muted
        ></video>
      
        <footer>
          <button type="button" id="video">
            <i class="material-icons">
              videocam
            </i>
          </button>
          <button type="button" id="audio">
            <i class="material-icons">
              mic
            </i>
          </button>
          <button type="button" id="upload">
            <i class="material-icons">upload</i>
          </button>
        </footer>
      </section>
      
      <input
        type="file"
        name="files"
        id="inputFile"
        multiple="false"
      />
      
      <button class="call-end" (click)="end()">
        <i class="material-icons">call_end</i>
      </button>
      
      <div id="download" class="progress hidden">
        <progress value="0" max="100"></progress>
      </div>
    </main>
  `;

  local: HTMLElement;
  remote: HTMLElement;
  download: HTMLElement;

  upload: HTMLButtonElement;
  video: HTMLButtonElement;
  audio: HTMLButtonElement;
  inputFile: HTMLInputElement;

  connectedCallback() {
    this.local = this.querySelector('#local');
    this.remote = this.querySelector('#remote');
    this.download = this.querySelector('#download');

    this.video = this.querySelector('#video');
    this.audio = this.querySelector('#audio');
    this.upload = this.querySelector('#upload');
    this.inputFile = this.querySelector('#inputFile');

    const params = this.getParams(location);
    const meetId = params.get('meetId');

    if (meetId) this.meetId = meetId;
    else this.meetId = '';

    this.onInit();
  }

  onInit() {
    this.peer.event.on('stream', (stream) => {
      const video = this.getVideo(this.local);
      video.srcObject = stream;
    });

    this.peer.event.on('track', () => {
      const video = this.getVideo(this.remote);
      video.srcObject = this.peer.remote;
    });

    this.peer.connect(this.meetId);
    const progress = this.getProgress(this.download);
    this.peer.event.on('progress', ({ percent }) => {
      progress.setAttribute('value', `${percent}%`);
    });

    this.handleAudio();
    this.handleVideo();
    this.handleUpload();
  }

  handleAudio() {
    this.peer.event.on('toggleAudio', (state) => {
      const icon = this.audio.querySelector('i');
      icon.textContent = state ? 'mic_off' : 'mic';
    });
    this.audio.onclick = () => {
      this.peer.toggleAudio(this.peer.stream);
    };
  }

  handleVideo() {
    this.peer.event.on('toggleVideo', (state) => {
      const icon = this.video.querySelector('i');
      icon.textContent = state ? 'videocam_off' : 'videocam';
    });
    this.video.onclick = () => {
      this.peer.toggleVideo(this.peer.stream);
    };
  }

  handleUpload() {
    this.upload.onclick = () => {
      this.inputFile.click();
    };

    this.inputFile.onchange = (event) => {
      const { files } = this.getTarget(event);

      if (files.length) {
        this.peer.upload(files.item(0));
      }
    };
  }

  getParams({ search }: Location) {
    return new URLSearchParams(search);
  }

  getTarget({ target }: Event) {
    return target as HTMLInputElement;
  }

  getVideo(container: HTMLElement) {
    return container.querySelector('video');
  }

  getProgress(container: HTMLElement) {
    return container.querySelector('progress');
  }
}
customElements.define('webrtc-root', AppElement);
