import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SuperPowerService } from '../../services/superpower.service';
import { SidekickService } from '../../services/sidekick.service';
import { SuperHeroImagesService } from '../../services/superheroimages.service';
import { Sidekick } from '../../models/Sidekick.model';
import { SuperPower } from '../../models/SuperPower.model';
import { SuperHeroImage } from '../../models/SuperHeroImage.model';

interface SuperHero {
  id: string;
  name: string;
  alias: string;
  age: number;
  origin: string;
  firstAppearance: string;
  isActive: boolean;
}

interface ProductStock {
  id: string;
  superHeroId: string;
  unitPrice: number;
  quantity: number;
  sku: string;
  description: string;
  currency: string;
  isActive: boolean;
  lastUpdated: string;
}

@Component({
  selector: 'app-super-hero-details',
  templateUrl: './super-hero-details.component.html'
})
export class SuperHeroDetailsComponent implements OnInit {
  @Input() superHeroId: string = '';
  hero: SuperHero | null = null;
  loading = false;
  error = '';
  powers: SuperPower[] = [];
  sidekicks: Sidekick[] = [];
  images: SuperHeroImage[] = [];
  imageIndex = 0;
  productStock: ProductStock | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private powerService: SuperPowerService,
    private sidekickService: SidekickService,
    private imagesService: SuperHeroImagesService
  ) {}

  ngOnInit() {
    let id = this.superHeroId;
    this.route.params.subscribe(params => {
      if (params['id']) {
        id = params['id'];
      }
      if (id) {
        this.loading = true;
        this.error = '';
        this.http.get<SuperHero>(`https://localhost:7226/api/SuperHeroes/${id}`)
          .subscribe({
            next: data => {
              this.hero = data;
              this.loading = false;
              this.powerService.getBySuperHero(id).subscribe(powers => {
                this.powers = powers;
              });
              this.sidekickService.getBySuperHero(id).subscribe(sidekicks => {
                this.sidekicks = sidekicks;
              });
              this.imagesService.getImagesBySuperHero(id).subscribe(images => {
                this.images = images;
                this.imageIndex = 0;
              });
              // Fetch product stock details
              this.http.get<ProductStock>(`https://localhost:7226/api/ProductStock/by-superhero/${id}`)
                .subscribe({
                  next: stock => {
                    this.productStock = stock;
                  }
                });
            },
            error: () => {
              this.error = 'Could not load superhero details.';
              this.loading = false;
            }
          });
      }
    });
  }

  nextImage() {
    if (this.images.length > 0) {
      this.imageIndex = (this.imageIndex + 1) % this.images.length;
    }
  }

  prevImage() {
    if (this.images.length > 0) {
      this.imageIndex = (this.imageIndex - 1 + this.images.length) % this.images.length;
    }
  }
}