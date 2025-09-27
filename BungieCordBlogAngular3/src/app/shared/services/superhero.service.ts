import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuperHero } from '../models/SuperHero.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SuperHeroService {
  private apiUrl = 'https://localhost:7226/api/SuperHeroes';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('Authorization');
    return new HttpHeaders({
      'Authorization': `${token}`
    });
  }

  getAll(): Observable<SuperHero[]> {
    return this.http.get<SuperHero[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getUserSuperHeroes(): Observable<SuperHero[]> {
    return this.http.get<SuperHero[]>(
      `${this.apiUrl}/user-superheroes`,
      { headers: this.getAuthHeaders() }
    );
  }

  getById(id: string): Observable<SuperHero> {
    return this.http.get<SuperHero>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  create(hero: SuperHero): Observable<SuperHero> {
    return this.http.post<SuperHero>(this.apiUrl, hero, { headers: this.getAuthHeaders() });
  }

  update(id: string, hero: SuperHero): Observable<SuperHero> {
    return this.http.put<SuperHero>(`${this.apiUrl}/${id}`, hero, { headers: this.getAuthHeaders() });
  }

  delete(id: string): Observable<SuperHero> {
    return this.http.delete<SuperHero>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}