1. [Ports](./PORTS.md)

1. [Adapters](./ADAPTERS.md)

1. [Gateway](./GATEWAY.md)

1. [Web App](./WEBAPP.md)
   1. [Web App](./WEBAPP.md)
   1. [Web App 2](./WEBAPP-2.md)
   1. [Web App 3](./WEBAPP-3.md)

---

# Web App

## Meet

### Implementando conferência

Perceba quem nós estamos injetando no construtor, não é a implementação, mas a abstração.

Isso permite a mudança de implementação sem afetar a aplicação.

Arquivo `apps/webapp/src/app/meet/meet.component.ts`

```ts
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Peer } from '@webrtc/ports';

@Component({
  selector: 'webrtc-meet',
  templateUrl: './meet.component.html',
  // styleUrls: ['./meet.component.scss']
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

### Estilos

#### Altera tipo do arquivo de CSS para SCSS

No diretório `apps/webapp/src/app/meet/`, alterar de `meet.component.css` para `meet.component.scss` e então descomentar linha `9` no arquivo `meet.component.ts`

#### Adicionando estilos

Arquivo `apps/webapp/src/app/meet/meet.component.scss`

```scss
:host {
  flex: 1;
  margin: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.container {
  padding: 8px;
  width: 100%;
  max-width: 1920px;
  max-height: 1080px;
  display: flex;
  object-fit: contain;
  flex-direction: column;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.8);
}

section {
  padding: 0;
  overflow: hidden;
  border-radius: 8px;

  background-color: white;

  &.videoff {
    transition: background-color 250ms ease-in-out;

    background-color: rgba(255, 255, 255, 0.2);

    video {
      opacity: 0;
      transition: opacity 250ms ease-in-out;
    }

    footer {
      opacity: 0.6;
      transition: opacity 250ms ease-in-out;
    }
  }
}

.progress {
  top: 0;
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  progress {
    width: 50%;
    height: 64px;
  }
}

video {
  width: 100%;
  max-width: 100%;
}

input[type='file'] {
  display: none;
}

section#remote {
  video {
    width: 100%;
    max-width: 100%;
    border-radius: 12px;
    margin-bottom: -6px;
  }
}

section#local {
  max-width: 200px;
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 10;

  & > footer {
    margin: 0;
    padding: 0;
    display: flex;
    margin-bottom: 0;
    justify-content: space-between;

    background-color: white;

    opacity: 0.6;
    transition: opacity 250ms ease-in-out;

    &:hover {
      opacity: 1;
    }

    button {
      width: 33%;
      background-color: transparent;
    }
  }
}

.call-end {
  width: 64px;
  height: 64px;

  i {
    font-size: 32px;
    line-height: 32px;
  }

  border-radius: 50%;
  display: flex;
  color: white;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  background-color: red;
  position: fixed;
  right: 20px;
  bottom: 20px;
}
```

#### Template

Arquivo `apps/webapp/src/app/meet/meet.component.html`

```html
<section class="container" id="remote">
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
    <button type="button" (click)="peer.toggleVideo(peer.stream)">
      <i class="material-icons">
        {{ peer.uiState.video ? 'videocam_off' : 'videocam' }}
      </i>
    </button>
    <button type="button" (click)="peer.toggleAudio(peer.stream)">
      <i class="material-icons">
        {{ peer.uiState.audio ? 'mic_off' : 'mic' }}
      </i>
    </button>
    <button type="button" (click)="inputFile.click()">
      <i class="material-icons">upload</i>
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

<button class="call-end" (click)="end()">
  <i class="material-icons">call_end</i>
</button>

<div *ngIf="(peer.progress$ | async) !== 0" class="progress">
  <progress [value]="peer.progress$ | async" max="100"></progress>
</div>
```
