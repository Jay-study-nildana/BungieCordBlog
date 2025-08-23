import { Component, OnInit } from '@angular/core';
import { SuperPowerService } from 'src/app/shared/services/superpower.service';
import { SuperPower } from 'src/app/shared/models/SuperPower.model';
import { NotificationService } from 'src/app/features/auth/services/auth.NotificationService';
import { SuperHeroService } from 'src/app/shared/services/superhero.service';
import { SuperHero } from 'src/app/shared/models/SuperHero.model';

@Component({
  selector: 'app-superpower',
  templateUrl: './superpower.component.html'
})
export class SuperPowerComponent implements OnInit {
  powers: SuperPower[] = [];
  selectedPower: SuperPower | null = null;
  isEditing = false;
  superHeroes: SuperHero[] = [];

  constructor(
    private powerService: SuperPowerService,
    private notificationService: NotificationService,
    private superHeroService: SuperHeroService
  ) {}

  ngOnInit() {
    this.loadPowers();
    this.loadSuperHeroes();
  }

  loadPowers() {
    this.powerService.getAll().subscribe(data => this.powers = data);
  }

  loadSuperHeroes() {
    this.superHeroService.getAll().subscribe(data => this.superHeroes = data);
  }

  getSuperHeroName(superHeroId: string): string {
    const hero = this.superHeroes.find(h => h.id === superHeroId);
    return hero ? hero.name : superHeroId;
  }

  selectPower(power: SuperPower) {
    this.selectedPower = { ...power };
    this.isEditing = true;
  }

  newPower() {
    this.selectedPower = {
      powerName: '',
      description: '',
      superHeroId: ''
    };
    this.isEditing = false;
  }

  savePower() {
    if (this.selectedPower?.id) {
      this.powerService.update(this.selectedPower.id, this.selectedPower).subscribe(() => {
        this.loadPowers();
        this.selectedPower = null;
        this.notificationService.show('SuperPower updated successfully!');
      });
    } else if (this.selectedPower) {
      this.powerService.create(this.selectedPower).subscribe(() => {
        this.loadPowers();
        this.selectedPower = null;
        this.notificationService.show('SuperPower created successfully!');
      });
    }
  }

  deletePower(id: string) {
    this.powerService.delete(id).subscribe(() => {
      this.loadPowers();
      this.notificationService.show('SuperPower deleted successfully!');
    });
  }

  cancel() {
    this.selectedPower = null;
  }
}