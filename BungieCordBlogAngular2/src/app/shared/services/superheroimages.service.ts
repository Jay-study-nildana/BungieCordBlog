import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuperHeroImage } from '../models/SuperHeroImage.model';

@Injectable({
  providedIn: 'root'
})
export class SuperHeroImagesService {
  private apiBase = 'https://localhost:7226/api/SuperHeroes';

  constructor(private http: HttpClient) {}

  getImagesBySuperHero(superHeroId: string): Observable<SuperHeroImage[]> {
    return this.http.get<SuperHeroImage[]>(`${this.apiBase}/${superHeroId}/images`);
  }
}