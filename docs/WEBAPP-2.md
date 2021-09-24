# Web App

## Criando o app providers

```sh
nx g class app-providers --project webapp --skip-tests
```

### Relacionando ports e adapters como providers

```ts
import { PeerImpl, SignalingImpl } from '@webrtc/adapters';
import { Peer, Signaling, Socket } from '@webrtc/ports';

export class AppProviders {
  static forPorts({
    signaling,
    iceServers,
  }: {
    signaling: string;
    iceServers: RTCIceServer[];
  }) {
    return [
      {
        provide: Signaling,
        useFactory: () => {
          return new SignalingImpl(signaling);
        },
      },
      {
        provide: Peer,
        useFactory: (signaling: Signaling<Socket>) => {
          return new PeerImpl({ iceServers: iceServers }, signaling);
        },
        deps: [Signaling],
      },
    ];
  }
}
```

### Adicionando configuração do ambiente

```ts
export const environment: {
  production: boolean;
  signaling: string;
  iceServers: RTCIceServer[];
} = {
  production: false,
  signaling: 'http://localhost:3333',
  iceServers: [
    {
      urls: ['stun:54.90.98.123:3478'],
      username: 'works',
      credential: 'contact',
      credentialType: 'password',
    },
  ],
};
```

### Importando providers

```ts
@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [AppProviders.forPorts(environment)],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## App

### Template

```html
<main>
  <router-outlet></router-outlet>
</main>
```

### Estilos

```scss
:host {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  main {
    flex: 1;
    width: 100%;
    display: flex;
  }

  background-color: #00bb77;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpolygon fill='%23000' fill-opacity='.1' points='120 0 120 60 90 30 60 0 0 0 0 0 60 60 0 120 60 120 90 90 120 60 120 0'/%3E%3C/svg%3E");
}
```

## Home

### Importando reactive forms

Arquivo `apps/webapp/src/app/app.module.ts`

```ts
  imports: [
    ...
    ReactiveFormsModule,
    ...
  ]
```

### Criando form de entrada

Arquivo `apps/webapp/src/app/home/home.component.ts`

```ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export type ObjOf<T = unknown> = Record<string, T>;

export const toJson = <R>(data: string) => JSON.parse(data) as R;
export const toText = <T extends ObjOf<T[keyof T]>>(data: T) =>
  JSON.stringify(data);

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

@Component({
  selector: 'webrtc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  form = this._fb.group({
    nickname: ['', Validators.required],
    meet: ['', Validators.required],
  });

  constructor(private _fb: FormBuilder, private _router: Router) {}

  async ngOnInit() {
    console.log(uuid());

    this.form.patchValue({ meet: uuid() });
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      const { meet } = this.form.value;
      this._router.navigate(['/', 'meet', meet], this.form.value);
    }
  }
}
```

Arquivo `apps/webapp/src/app/home/home.component.html`

```html
<form [formGroup]="form" (ngSubmit)="onSubmit(form)">
  <section>
    <label>Sala</label>
    <input matInput formControlName="meet" placeholder="Sala" />
    <small>
      Este código foi gerado aleatoriamente, mas é possível altera-lo
    </small>
  </section>

  <section>
    <label>Nickname</label>
    <input
      autofocus
      formControlName="nickname"
      placeholder="Qual seu apelido?"
    />
  </section>

  <footer>
    <button [disabled]="form.invalid">Entrar na sala</button>
  </footer>
</form>
```

Arquivo `apps/webapp/src/app/home/home.component.scss`

```scss
:host {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  form {
    gap: 16px;
    padding: 16px;

    input {
      width: 100%;
    }

    section {
      display: flex;
      flex-direction: column;
      margin-top: 8px;
      width: 260px;

      button {
        margin-top: 2px;
        margin-left: 12px;
        margin-bottom: 22px;
        padding-left: 22px;
        padding-right: 22px;
      }
    }

    footer {
      margin-top: 24px;
    }
  }
}
```
