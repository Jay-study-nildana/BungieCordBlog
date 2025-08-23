import { Component, OnInit } from '@angular/core';
import { SidekickService } from 'src/app/shared/services/sidekick.service';
import { Sidekick } from 'src/app/shared/models/Sidekick.model';
import { NotificationService } from 'src/app/features/auth/services/auth.NotificationService';
import { SuperHeroService } from 'src/app/shared/services/superhero.service';
import { SuperHero } from 'src/app/shared/models/SuperHero.model';

@Component({
  selector: 'app-sidekick',
  templateUrl: './sidekick.component.html'
})
export class SidekickComponent implements OnInit {
  sidekicks: Sidekick[] = [];
  selectedSidekick: Sidekick | null = null;
  isEditing = false;
  superHeroes: SuperHero[] = [];

  constructor(
    private sidekickService: SidekickService,
    private notificationService: NotificationService,
    private superHeroService: SuperHeroService
  ) {}

  ngOnInit() {
    this.loadSidekicks();
    this.loadSuperHeroes();
  }

  loadSidekicks() {
    this.sidekickService.getAll().subscribe(data => this.sidekicks = data);
  }

  loadSuperHeroes() {
    this.superHeroService.getAll().subscribe(data => this.superHeroes = data);
  }

  getSuperHeroName(superHeroId: string): string {
    const hero = this.superHeroes.find(h => h.id === superHeroId);
    return hero ? hero.name : superHeroId;
  }

  selectSidekick(sidekick: Sidekick) {
    this.selectedSidekick = { ...sidekick };
    this.isEditing = true;
  }

  newSidekick() {
    this.selectedSidekick = {
      name: '',
      age: 0,
      superHeroId: ''
    };
    this.isEditing = false;
  }

  saveSidekick() {
    if (this.selectedSidekick?.id) {
      this.sidekickService.update(this.selectedSidekick.id, this.selectedSidekick).subscribe(() => {
        this.loadSidekicks();
        this.selectedSidekick = null;
        this.notificationService.show('Sidekick updated successfully!');
      });
    } else if (this.selectedSidekick) {
      this.sidekickService.create(this.selectedSidekick).subscribe(() => {
        this.loadSidekicks();
        this.selectedSidekick = null;
        this.notificationService.show('Sidekick created successfully!');
      });
    }
  }

  deleteSidekick(id: string) {
    this.sidekickService.delete(id).subscribe(() => {
      this.loadSidekicks();
      this.notificationService.show('Sidekick deleted successfully!');
    });
  }

  cancel() {
    this.selectedSidekick = null;
  }
}