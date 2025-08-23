import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuperPower } from '../models/SuperPower.model';

@Injectable({
  providedIn: 'root'
})
export class SuperPowerService {
  private apiUrl = 'https://localhost:7226/api/SuperPowers';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SuperPower[]> {
    return this.http.get<SuperPower[]>(this.apiUrl);
  }

  getById(id: string): Observable<SuperPower> {
    return this.http.get<SuperPower>(`${this.apiUrl}/${id}`);
  }

  getBySuperHero(superHeroId: string): Observable<SuperPower[]> {
    return this.http.get<SuperPower[]>(`${this.apiUrl}/by-superhero/${superHeroId}`);
  }

  create(power: SuperPower): Observable<SuperPower> {
    return this.http.post<SuperPower>(this.apiUrl, power);
  }

  update(id: string, power: SuperPower): Observable<SuperPower> {
    return this.http.put<SuperPower>(`${this.apiUrl}/${id}`, power);
  }

  delete(id: string): Observable<SuperPower> {
    return this.http.delete<SuperPower>(`${this.apiUrl}/${id}`);
  }
}