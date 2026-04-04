import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailFormComponent } from './components/email-form/email-form.component';

// Define your routes here
const routes: Routes = [
  { path: 'email-form', component: EmailFormComponent },
  // You can add more routes as needed
  { path: '', redirectTo: 'email-form', pathMatch: 'full' }, // Example of a default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })], // Added `bindToComponentInputs` available in Angular 16
  exports: [RouterModule],
})
export class AppRoutingModule {}