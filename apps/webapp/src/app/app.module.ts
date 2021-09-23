import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ConfigComponent } from './config/config.component';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppProviders } from './app.provider';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, ConfigComponent, HomeComponent],
  imports: [
    BrowserModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    HttpClientModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    AppRoutingModule
    // RouterModule.forRoot([{ path: 'meet', loadChildren: () => import('./meet/meet.module').then(m => m.MeetModule) }], { initialNavigation: 'enabledBlocking' }),
  ],
  providers: [
    AppProviders.forPorts(environment)
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
