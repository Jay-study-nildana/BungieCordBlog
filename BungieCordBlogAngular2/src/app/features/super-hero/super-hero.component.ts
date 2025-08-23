import { Component, OnInit } from '@angular/core';
import { SuperHeroService } from 'src/app/shared/services/superhero.service';
import { SuperHero } from 'src/app/shared/models/SuperHero.model';
import { SuperPowerService } from 'src/app/shared/services/superpower.service';
import { SuperPower } from 'src/app/shared/models/SuperPower.model';
import { NotificationService } from 'src/app/features/auth/services/auth.NotificationService';

@Component({
  selector: 'app-super-hero',
  templateUrl: './super-hero.component.html'
})
export class SuperHeroComponent implements OnInit {
  heroes: SuperHero[] = [];
  selectedHero: SuperHero | null = null;
  isEditing = false;

  // For details view
  detailsHeroId: string | null = null;
  detailsHero: SuperHero | null = null;
  detailsPowers: SuperPower[] = [];
  loadingDetails = false;

  constructor(
    private heroService: SuperHeroService,
    private powerService: SuperPowerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadHeroes();
  }

  loadHeroes() {
    this.heroService.getAll().subscribe(data => this.heroes = data);
  }

  selectHero(hero: SuperHero) {
    this.selectedHero = { ...hero };
    this.isEditing = true;
  }

  newHero() {
    this.selectedHero = {
      name: '',
      alias: '',
      age: 0,
      origin: '',
      firstAppearance: new Date().toISOString(),
      isActive: true
    };
    this.isEditing = false;
  }

  saveHero() {
    if (this.selectedHero?.id) {
      this.heroService.update(this.selectedHero.id, this.selectedHero).subscribe(() => {
        this.loadHeroes();
        this.selectedHero = null;
        this.notificationService.show('SuperHero updated successfully!');
      });
    } else if (this.selectedHero) {
      this.heroService.create(this.selectedHero).subscribe(() => {
        this.loadHeroes();
        this.selectedHero = null;
        this.notificationService.show('SuperHero created successfully!');
      });
    }
  }

  deleteHero(id: string) {
    this.heroService.delete(id).subscribe(() => {
      this.loadHeroes();
      this.notificationService.show('SuperHero deleted successfully!');
    });
  }

  cancel() {
    this.selectedHero = null;
  }

  // Details logic
  toggleDetails(heroId: string) {
    if (this.detailsHeroId === heroId) {
      // Hide details if already open
      this.detailsHeroId = null;
      this.detailsHero = null;
      this.detailsPowers = [];
      return;
    }
    this.detailsHeroId = heroId;
    this.loadingDetails = true;
    // Fetch hero details
    this.heroService.getById(heroId).subscribe(hero => {
      this.detailsHero = hero;
      // Fetch powers for this hero
      this.powerService.getBySuperHero(heroId).subscribe(powers => {
        this.detailsPowers = powers;
        this.loadingDetails = false;
      });
    });
  }
}