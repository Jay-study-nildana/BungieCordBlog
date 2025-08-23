import { Component, OnInit } from '@angular/core';
import { ComicAppearanceService } from 'src/app/shared/services/comicappearance.service';
import { ComicAppearance } from 'src/app/shared/models/ComicAppearance.model';
import { NotificationService } from 'src/app/features/auth/services/auth.NotificationService';
import { SuperHeroService } from 'src/app/shared/services/superhero.service';
import { SuperHero } from 'src/app/shared/models/SuperHero.model';

@Component({
  selector: 'app-comicappearance',
  templateUrl: './comicappearance.component.html'
})
export class ComicAppearanceComponent implements OnInit {
  appearances: ComicAppearance[] = [];
  selectedAppearance: ComicAppearance | null = null;
  isEditing = false;
  superHeroes: SuperHero[] = [];

  constructor(
    private appearanceService: ComicAppearanceService,
    private notificationService: NotificationService,
    private superHeroService: SuperHeroService
  ) {}

  ngOnInit() {
    this.loadAppearances();
    this.loadSuperHeroes();
  }

  loadAppearances() {
    this.appearanceService.getAll().subscribe(data => this.appearances = data);
  }

  loadSuperHeroes() {
    this.superHeroService.getAll().subscribe(data => this.superHeroes = data);
  }

  getSuperHeroName(superHeroId: string): string {
    const hero = this.superHeroes.find(h => h.id === superHeroId);
    return hero ? hero.name : superHeroId;
  }

  selectAppearance(appearance: ComicAppearance) {
    this.selectedAppearance = { ...appearance };
    this.isEditing = true;
  }

  newAppearance() {
    this.selectedAppearance = {
      comicTitle: '',
      issueNumber: 0,
      releaseDate: '',
      superHeroId: ''
    };
    this.isEditing = false;
  }

  saveAppearance() {
    if (this.selectedAppearance?.id) {
      this.appearanceService.update(this.selectedAppearance.id, this.selectedAppearance).subscribe(() => {
        this.loadAppearances();
        this.selectedAppearance = null;
        this.notificationService.show('Comic Appearance updated successfully!');
      });
    } else if (this.selectedAppearance) {
      this.appearanceService.create(this.selectedAppearance).subscribe(() => {
        this.loadAppearances();
        this.selectedAppearance = null;
        this.notificationService.show('Comic Appearance created successfully!');
      });
    }
  }

  deleteAppearance(id: string) {
    this.appearanceService.delete(id).subscribe(() => {
      this.loadAppearances();
      this.notificationService.show('Comic Appearance deleted successfully!');
    });
  }

  cancel() {
    this.selectedAppearance = null;
  }
}