import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { AppProviders } from './app-providers';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    AppProviders.forPorts(environment)
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
