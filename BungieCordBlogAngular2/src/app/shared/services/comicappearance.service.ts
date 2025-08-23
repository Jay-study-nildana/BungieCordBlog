import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComicAppearance } from '../models/ComicAppearance.model';

@Injectable({
  providedIn: 'root'
})
export class ComicAppearanceService {
  private apiUrl = 'https://localhost:7226/api/ComicAppearances';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ComicAppearance[]> {
    return this.http.get<ComicAppearance[]>(this.apiUrl);
  }

  getById(id: string): Observable<ComicAppearance> {
    return this.http.get<ComicAppearance>(`${this.apiUrl}/${id}`);
  }

  create(appearance: ComicAppearance): Observable<ComicAppearance> {
    return this.http.post<ComicAppearance>(this.apiUrl, appearance);
  }

  update(id: string, appearance: ComicAppearance): Observable<ComicAppearance> {
    return this.http.put<ComicAppearance>(`${this.apiUrl}/${id}`, appearance);
  }

  delete(id: string): Observable<ComicAppearance> {
    return this.http.delete<ComicAppearance>(`${this.apiUrl}/${id}`);
  }

    getBySuperHero(superHeroId: string): Observable<ComicAppearance[]> {
    return this.http.get<ComicAppearance[]>(`${this.apiUrl}/by-superhero/${superHeroId}`);
  }
}