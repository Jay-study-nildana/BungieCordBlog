import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  model = { email: '', password: '' };
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  onFormSubmit() {
    this.successMessage = '';
    this.errorMessage = '';
    this.http.post('https://localhost:7226/api/Auth/register', this.model)
      .subscribe({
        next: () => {
          this.successMessage = 'Registration successful!';
          this.model = { email: '', password: '' };
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Registration failed.';
        }
      });
  }
}