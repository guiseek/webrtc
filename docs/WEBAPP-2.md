1. [Ports](./PORTS.md)

1. [Adapters](./ADAPTERS.md)

1. [Gateway](./GATEWAY.md)

1. [Web App](./WEBAPP.md)
    1. [Web App](./WEBAPP.md)
    1. [Web App 2](./WEBAPP-2.md)
    1. [Web App 3](./WEBAPP-3.md)

---
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

### Index

Arquivo `apps/webapp/src/index.html`

```html
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="utf-8" />
    <title>Webapp</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap" rel="stylesheet">
  </head>
  <body>
    <webrtc-root></webrtc-root>
  </body>
</html>
```

### Component

Arquivo `apps/webapp/src/app/app.component.html`

```html
<main>
  <router-outlet></router-outlet>
</main>
```

### Estilos

Arquivo `apps/webapp/src/styles.scss`

```scss
html,
body {
  height: 100%;
}

body {
  margin: 0;
  font-size: 1.4rem;
  font-family: 'Source Sans Pro', sans-serif;
}

button {
  border: 0;
  font-size: 100%;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
}
```

Arquivo `apps/webapp/src/app/app.component.scss`

```scss
:host {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-image: url(https://codecon.dev/dark-city.png);
  background-repeat: no-repeat;
  background-size: 100%;
  background-color: #232933;

  main {
    flex: 1;
    width: 100%;
    display: flex;

    margin: 0;
    font-size: 1.4rem;
    font-family: 'Source Sans Pro', sans-serif;

    background-image: url(https://codecon.dev/sand.png);
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: 100%;
  }
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
    gap: 24px;
    display: flex;
    flex-direction: column;
    padding: 16px;
    color: white;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 16px;

    input {
      margin: 4px 0;
      padding: 16px;
      border-radius: 8px;
      font-size: 1.4rem;
      color: #724bfe;
      border: 0;
    }

    section {
      display: flex;
      flex-direction: column;
      margin-top: 8px;
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
