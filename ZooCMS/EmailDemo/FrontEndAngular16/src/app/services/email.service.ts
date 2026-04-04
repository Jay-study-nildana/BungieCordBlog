import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private baseUrl = 'https://localhost:7160/api/Email'; // Your Web API base URL

  constructor(private http: HttpClient) {}

  sendEmail(to: string, subject: string, body: string): Observable<string> {
    const emailRequest = { to, subject, body };
    return this.http.post(`${this.baseUrl}/send`, emailRequest, {
      responseType: 'text', // Specify response type as text
    });
  }
}