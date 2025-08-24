import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface SuperHero {
  id: string;
  name: string;
  alias: string;
  age: number;
  origin: string;
  firstAppearance: string;
  isActive: boolean;
}

interface SuperPower {
  id: string;
  powerName: string;
  description: string;
  superHeroId: string;
}

interface Sidekick {
  id: string;
  name: string;
  age: number;
  superHeroId: string;
}

interface ComicAppearance {
  id: string;
  comicTitle: string;
  issueNumber: number;
  releaseDate: string;
  superHeroId: string;
}

interface SidekickComicAppearance {
  sidekickId: string;
  comicAppearanceId: string;
}

interface SearchResponse {
  superHeroes: SuperHero[];
  superPowers: SuperPower[];
  sidekicks: Sidekick[];
  comicAppearances: ComicAppearance[];
  sidekickComicAppearances: SidekickComicAppearance[];
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {
  query: string = '';
  loading = false;
  error = '';
  results: SearchResponse | null = null;

  constructor(private http: HttpClient) {}

  search() {
    if (!this.query.trim()) return;
    this.loading = true;
    this.error = '';
    this.http.get<SearchResponse>(`https://localhost:7226/api/SuperHeroUniverse/search?q=${encodeURIComponent(this.query)}`)
      .subscribe({
        next: data => {
          this.results = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Search failed. Please try again.';
          this.loading = false;
        }
      });
  }
}