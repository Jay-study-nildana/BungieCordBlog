import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuperHero } from '../models/SuperHero.model';

@Injectable({
  providedIn: 'root'
})
export class SuperHeroService {
  private apiUrl = 'https://localhost:7226/api/SuperHeroes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SuperHero[]> {
    return this.http.get<SuperHero[]>(this.apiUrl);
  }

  getById(id: string): Observable<SuperHero> {
    return this.http.get<SuperHero>(`${this.apiUrl}/${id}`);
  }

  create(hero: SuperHero): Observable<SuperHero> {
    return this.http.post<SuperHero>(this.apiUrl, hero);
  }

  update(id: string, hero: SuperHero): Observable<SuperHero> {
    return this.http.put<SuperHero>(`${this.apiUrl}/${id}`, hero);
  }

  delete(id: string): Observable<SuperHero> {
    return this.http.delete<SuperHero>(`${this.apiUrl}/${id}`);
  }
}