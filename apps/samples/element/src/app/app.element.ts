import { environment } from '../environments/environment';
import { Dialog } from '@material/mwc-dialog';
import { loadModule } from './app.providers';
import { URLJoin } from './app.utils';
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
      
      <section id="local">
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
        id="input-file"
        multiple="false"
      />
      
      <button id="call-end">
        <i class="material-icons">call_end</i>
      </button>
      
      <div id="download" class="hidden">
        <progress value="0" max="100"></progress>
      </div>
    </main>

    <mwc-dialog id="dialog-confirm" heading="Atenção">
      <div>
        A conexão ainda está ativa.
        <br />
        Ainda sim quer sair da sala?
      </div>
      <mwc-button
          id="confirm-submit"
          slot="primaryAction"
          dialogAction="discard">
        Sim, sair
      </mwc-button>
      <mwc-button
          slot="secondaryAction"
          dialogAction="cancel">
        Cancelar
      </mwc-button>
    </mwc-dialog>

    <mwc-dialog id="dialog-form" heading="Acessar uma reunião">
      <p>Nome ou código da sala</p>
      <mwc-textfield
        id="text-field"
        minlength="6"
        maxlength="64"
        placeholder="Digite aqui..."
        required>
      </mwc-textfield>
      <mwc-button
        id="form-submit"
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
  endCall: HTMLButtonElement;
  inputFile: HTMLInputElement;

  dialogForm: Dialog;
  textField: HTMLInputElement;
  formSubmit: HTMLButtonElement;

  dialogConfirm: Dialog;
  confirmSubmit: HTMLButtonElement;

  connectedCallback() {
    this.main = this.querySelector('main');
    this.local = this.querySelector('#local');
    this.remote = this.querySelector('#remote');
    this.download = this.querySelector('#download');

    this.video = this.querySelector('#video');
    this.audio = this.querySelector('#audio');
    this.upload = this.querySelector('#upload');
    this.endCall = this.querySelector('#call-end');
    this.inputFile = this.querySelector('#input-file');

    this.textField = this.querySelector('#text-field');
    this.dialogForm = this.querySelector('#dialog-form');
    this.formSubmit = this.querySelector('#form-submit');
    this.confirmSubmit = this.querySelector('#confirm-submit');
    this.dialogConfirm = this.querySelector('#dialog-confirm');

    const params = this.getParams(location);
    const meetId = params.get('meetId');

    if (meetId) {
      this.meetId = meetId;
      this.main.classList.remove('hidden');
    } else {
      this.meetId = '';
      this.dialogForm.show();
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
      if (+percent.toFixed(0) === 0) {
        this.download.classList.add('hidden');
      } else {
        this.download.classList.remove('hidden');
      }
      progress.setAttribute('value', percent.toFixed(0));
    });

    this.handleAudio();
    this.handleVideo();
    this.handleUpload();
    this.handleConfirm();
    this.handleEndCall();
  }

  handleConfirm() {
    this.formSubmit.onclick = () => {
      const isValid = this.textField.checkValidity();
      if (isValid) this.goToMeet();
      else this.textField.reportValidity();
    };
  }

  handleEndCall() {
    this.endCall.onclick = () => {
      this.dialogConfirm.show();
      this.confirmSubmit.onclick = () => {
        location.href = location.origin;
      };
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
    const domain = location.origin;
    const { value } = this.textField;
    const params = `?meetId=${value}`;
    const url = URLJoin(domain, params);
    location.href = url;
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
