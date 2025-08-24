import { Component, OnInit } from '@angular/core';
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

interface SuperHeroImage {
  superHeroId: string;
  id: string;
  fileName: string;
  fileExtension: string;
  title: string;
  url: string;
  dateCreated: string;
}

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html'
})
export class Home2Component implements OnInit {
  heroes: SuperHero[] = [];
  loading = true;
  heroImages: { [heroId: string]: SuperHeroImage[] } = {};
  heroImageIndex: { [heroId: string]: number } = {};
  selectedDetailsId: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<SuperHero[]>('https://localhost:7226/api/SuperHeroes')
      .subscribe({
        next: data => {
          this.heroes = data;
          this.loading = false;
          // Fetch images for each hero
          this.heroes.forEach(hero => {
            this.heroImageIndex[hero.id] = 0;
            this.http.get<SuperHeroImage[]>(`https://localhost:7226/api/SuperHeroes/${hero.id}/images`)
              .subscribe(images => {
                this.heroImages[hero.id] = images;
              });
          });
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  nextImage(heroId: string) {
    const images = this.heroImages[heroId] || [];
    if (images.length === 0) return;
    this.heroImageIndex[heroId] = (this.heroImageIndex[heroId] + 1) % images.length;
  }

  prevImage(heroId: string) {
    const images = this.heroImages[heroId] || [];
    if (images.length === 0) return;
    this.heroImageIndex[heroId] = (this.heroImageIndex[heroId] - 1 + images.length) % images.length;
  }
}