import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sidekick } from '../models/Sidekick.model';

@Injectable({
  providedIn: 'root'
})
export class SidekickService {
  private apiUrl = 'https://localhost:7226/api/Sidekicks';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sidekick[]> {
    return this.http.get<Sidekick[]>(this.apiUrl);
  }

  getById(id: string): Observable<Sidekick> {
    return this.http.get<Sidekick>(`${this.apiUrl}/${id}`);
  }

  create(sidekick: Sidekick): Observable<Sidekick> {
    return this.http.post<Sidekick>(this.apiUrl, sidekick);
  }

  update(id: string, sidekick: Sidekick): Observable<Sidekick> {
    return this.http.put<Sidekick>(`${this.apiUrl}/${id}`, sidekick);
  }

  delete(id: string): Observable<Sidekick> {
    return this.http.delete<Sidekick>(`${this.apiUrl}/${id}`);
  }

    getBySuperHero(superHeroId: string): Observable<Sidekick[]> {
    return this.http.get<Sidekick[]>(`${this.apiUrl}/by-superhero/${superHeroId}`);
  }
}