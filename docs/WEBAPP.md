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

## Criando módulo da conferência

```sh
nx g m meet --route meet --module app --project webapp
```


### Configurando rotas

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
        {
          path: 'meet',
          loadChildren: () =>
            import('./meet/meet.module').then((m) => m.MeetModule),
        },
      ],
      { initialNavigation: 'enabledBlocking' }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

### Importando app routing

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Servindo a aplicação

```sh
nx run-many --target=serve --all --parallel --max-parallel=2
```