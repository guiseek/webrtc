# Web App

## Meet

### Configurando rota da conferência

Arquivo `apps/webapp/src/app/meet/meet-routing.module.ts`

```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeetComponent } from './meet.component';

const routes: Routes = [{ path: ':meet', component: MeetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetRoutingModule { }
```

### Criando componente

Arquivo `apps/webapp/src/app/meet/meet.component.ts`

```ts
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
  }

  ngOnInit(): void {
    this.peer.connect(this.meet);
  }
  end() {
    this.peer.close();
    this._router.navigate(['/']);
  }
}
```

Arquivo `apps/webapp/src/app/meet/meet.component.html`

```html
<section id="remote">
  <video autoplay playsinline [srcObject]="peer.remote"></video>
</section>

<section id="local" [ngClass]="{ videoff: peer.uiState.video }">
  <video
    autoplay
    playsinline
    [muted]="!!peer.stream"
    [srcObject]="peer.stream"
  ></video>

  <footer>
    <button type="button" i-button (click)="peer.toggleVideo(peer.stream)">
      <i>
        {{ peer.uiState.video ? 'videocam_off' : 'videocam' }}
      </i>
    </button>
    <button type="button" i-button (click)="peer.toggleAudio(peer.stream)">
      <i>{{ peer.uiState.audio ? 'mic_off' : 'mic' }}</i>
    </button>
    <button type="button" i-button (click)="inputFile.click()">
      <i>upload</i>
    </button>
  </footer>
</section>

<input
  #inputFile
  type="file"
  name="files"
  [multiple]="false"
  (change)="peer.upload($any($event.target).files[0])"
/>

<button (click)="end()">
  <i>call_end</i>
</button>

<div *ngIf="(peer.progress$ | async) !== 0" class="progress">
  <progress [value]="peer.progress$ | async"></progress>
</div>
```

Arquivo `apps/webapp/src/app/meet/meet.component.scss`

```scss
:host {
  flex: 1;
  margin: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  object-fit: contain;
}

section {
  padding: 0;
  overflow: hidden;
  border-radius: 8px;

  background-color: white;
  &.videoff {
    transition: opacity 250ms ease-in-out;
    opacity: 0.2;
    video {
      opacity: 0;
      transition: opacity 250ms ease-in-out;
    }
  }
}

progress {
  position: fixed;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

video {
  width: 100%;
  max-width: 100%;
}

input[type='file'] {
  display: none;
}

section#remote {
  border-radius: 8px 8px 28px 8px;
  object-fit: contain;
  width: 100%;
  flex: 1;
}

section#local {
  max-width: 200px;
  position: fixed;
  bottom: 20px;
  left: 20px;

  & > section-actions {
    margin: 0;
    padding: 0;
    opacity: 0.8;
    display: flex;
    margin-bottom: 0;
    justify-content: space-evenly;
  }
}
```