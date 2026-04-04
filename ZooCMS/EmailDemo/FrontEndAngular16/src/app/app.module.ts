import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmailFormComponent } from './components/email-form/email-form.component';

@NgModule({
  declarations: [
    AppComponent,
    EmailFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule, // Add HttpClientModule here
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}