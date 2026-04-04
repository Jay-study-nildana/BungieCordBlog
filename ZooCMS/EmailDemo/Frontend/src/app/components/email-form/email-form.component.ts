import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-email-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // RouterModule imported for routing support
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css'],
})
export class EmailFormComponent {
  to: string = '';
  subject: string = '';
  body: string = '';
  message: string = '';
  isError: boolean = false;

  constructor(private emailService: EmailService) {}

  sendEmail() {
    // Basic validation to ensure required fields are filled
    if (!this.to || !this.subject || !this.body) {
      this.isError = true;
      this.message = 'All fields are required!';
      return;
    }

    this.emailService.sendEmail(this.to, this.subject, this.body).subscribe({
      next: () => {
        this.isError = false;
        this.message = `Email sent successfully to ${this.to}!`;
        this.clearForm(); // Clear form fields after a successful email send
      },
      error: (err) => {
        console.error(err);
        this.isError = true;
        this.message = err?.error?.message || 'Failed to send email. Please try again later.';
      },
    });
  }

  private clearForm() {
    this.to = '';
    this.subject = '';
    this.body = '';
  }
}