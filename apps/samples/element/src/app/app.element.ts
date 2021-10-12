import { environment } from '../environments/environment';
import { Dialog } from '@material/mwc-dialog';
import { loadModule } from './app.providers';
import { Peer } from '@webp2p/ports';

import '@material/mwc-textfield';
import '@material/mwc-button';
import '@material/mwc-dialog';

import './app.element.scss';

const injector = loadModule(environment);

export class AppElement extends HTMLElement {
  meetId: string;

  peer = injector.get<Peer>(Peer);

  innerHTML = `
    <main class="hidden">
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

    <mwc-dialog id="dialog" heading="Acessar uma reunião">
      <p>Nome ou código da sala</p>
      <mwc-textfield
        id="text-field"
        minlength="6"
        maxlength="64"
        placeholder="Digite aqui..."
        required>
      </mwc-textfield>
      <mwc-button
        id="primary-button"
        slot="primaryAction">
        Confirmar
      </mwc-button>
    </mwc-dialog>
  `;

  main: HTMLElement;

  local: HTMLElement;
  remote: HTMLElement;
  download: HTMLElement;

  upload: HTMLButtonElement;
  video: HTMLButtonElement;
  audio: HTMLButtonElement;
  inputFile: HTMLInputElement;

  dialog: Dialog;
  textField: HTMLInputElement;
  primaryButton: HTMLButtonElement;

  connectedCallback() {
    this.main = this.querySelector('main');
    this.local = this.querySelector('#local');
    this.remote = this.querySelector('#remote');
    this.download = this.querySelector('#download');

    this.video = this.querySelector('#video');
    this.audio = this.querySelector('#audio');
    this.upload = this.querySelector('#upload');
    this.inputFile = this.querySelector('#inputFile');

    this.dialog = this.querySelector('#dialog');
    this.textField = this.querySelector('#text-field');
    this.primaryButton = this.querySelector('#primary-button');

    const params = this.getParams(location);
    const meetId = params.get('meetId');

    if (meetId) {
      this.meetId = meetId;
      this.main.classList.remove('hidden');
    } else {
      this.meetId = '';
      this.dialog.show();
    }

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
    this.handleConfirm();
  }

  handleConfirm() {
    this.primaryButton.onclick = () => {
      const isValid = this.textField.checkValidity();
      if (isValid) this.goToMeet();
      else this.textField.reportValidity();
    };
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

  goToMeet() {
    const { value } = this.textField;
    location.href = `?meetId=${value}`;
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
