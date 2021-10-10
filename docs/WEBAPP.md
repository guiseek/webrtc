1. [Ports](./PORTS.md)

1. [Adapters](./ADAPTERS.md)

1. [Gateway](./GATEWAY.md)

1. [Web App](./WEBAPP.md)
   1. [Web App](./WEBAPP.md)
   1. [Web App 2](./WEBAPP-2.md)
   1. [Web App 3](./WEBAPP-3.md)

---

# Web App

## Criando a aplicação

```sh
nx generate @nrwl/angular:application --name=webapp --backendProject=gateway --e2eTestRunner=none --routing
```

## Rotas

### Criando o app routing

```sh
nx g m app-routing --flat --project webapp
```

### Criando a página inicial

```sh
nx g c home --project webapp --skip-tests
```

### Configurando rotas

Arquivo `apps/webapp/src/app/app-routing.module.ts`

```ts
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: HomeComponent,
        },
      ],
      { initialNavigation: 'enabledBlocking' }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

## Criando módulo da conferência

```sh
nx g m meet --route meet --module app --project webapp
```

#### Configurando rota da reunião

Adicionar parâmetro `:meet` como código da reunião

Arquivo `apps/webapp/src/app/meet/meet-routing.module.ts`

```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeetComponent } from './meet.component';

const routes: Routes = [{ path: ':meet', component: MeetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetRoutingModule {}
```

### Importando app routing

Arquivo `apps/webapp/src/app/app.module.ts`

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Servindo a aplicação

```sh
nx run-many --target=serve --all --parallel --max-parallel=2
```


<center>

[Gateway &nbsp; 🔙 ](./GATEWAY.md) - [ 🔜 &nbsp; Web App 2](./WEBAPP-2.md)

</center>

---

[Guilherme Visi Siquinelli](https://guiseek.dev) &copy; 2021