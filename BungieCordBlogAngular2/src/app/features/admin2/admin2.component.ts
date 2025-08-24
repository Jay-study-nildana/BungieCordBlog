import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface AdminSummary {
  superHeroCount: number;
  superPowerCount: number;
  sidekickCount: number;
  comicAppearanceCount: number;
  sidekickComicAppearanceCount: number;
  userCount: number;
  roleCount: number;
}

@Component({
  selector: 'app-admin2',
  templateUrl: './admin2.component.html'
})
export class Admin2Component implements OnInit {
  summary: AdminSummary | null = null;
  loading = false;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loading = true;
    this.http.get<AdminSummary>('https://localhost:7226/api/SuperHeroUniverse/admin-summary')
      .subscribe({
        next: data => {
          this.summary = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load admin summary.';
          this.loading = false;
        }
      });
  }
}