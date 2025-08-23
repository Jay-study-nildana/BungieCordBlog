import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SidekickComicAppearance } from '../models/SidekickComicAppearance.model';

@Injectable({
  providedIn: 'root'
})
export class SidekickComicAppearanceService {
  private apiUrl = 'https://localhost:7226/api/SidekickComicAppearances';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SidekickComicAppearance[]> {
    return this.http.get<SidekickComicAppearance[]>(this.apiUrl);
  }

  getByIds(sidekickId: string, comicAppearanceId: string): Observable<SidekickComicAppearance> {
    return this.http.get<SidekickComicAppearance>(`${this.apiUrl}/${sidekickId}/${comicAppearanceId}`);
  }

  create(link: SidekickComicAppearance): Observable<SidekickComicAppearance> {
    return this.http.post<SidekickComicAppearance>(this.apiUrl, link);
  }

  update(sidekickId: string, comicAppearanceId: string, link: SidekickComicAppearance): Observable<SidekickComicAppearance> {
    return this.http.put<SidekickComicAppearance>(`${this.apiUrl}/${sidekickId}/${comicAppearanceId}`, link);
  }

  delete(sidekickId: string, comicAppearanceId: string): Observable<SidekickComicAppearance> {
    return this.http.delete<SidekickComicAppearance>(`${this.apiUrl}/${sidekickId}/${comicAppearanceId}`);
  }
}