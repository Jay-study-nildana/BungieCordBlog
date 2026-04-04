import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Bird {
  id: number;
  birdName: string;
  zooId: number;
  zoo?: any;
}

interface Zoo {
  id: number;
  nameOfZoo: string;
  locationOfZoo: string;
  birds: any[];
}

@Component({
  selector: 'app-zoo',
  templateUrl: './zoo.component.html',
  styleUrls: ['./zoo.component.css']
})
export class ZooComponent {
  zoos: Zoo[] = [];
  birds: Bird[] = [];
  loading = false;
  error: string | null = null;

  nameOfZoo = '';
  locationOfZoo = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getZoos();
    this.getBirds();
  }

  getZoos() {
    this.loading = true;
    this.error = null;
    this.http.get<Zoo[]>('https://localhost:7226/api/Practice/GetZoos')
      .subscribe({
        next: data => {
          this.zoos = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Error loading zoos';
          this.loading = false;
        }
      });
  }

  getBirds() {
    this.http.get<Bird[]>('https://localhost:7226/api/Practice/GetBirds')
      .subscribe({
        next: data => {
          this.birds = data;
        },
        error: () => {
          this.error = 'Error loading birds';
        }
      });
  }

  createZoo() {
    if (!this.nameOfZoo || !this.locationOfZoo) return;
    this.loading = true;
    this.error = null;
    this.http.post<Zoo>('https://localhost:7226/api/Practice/CreateZoo', {
      nameOfZoo: this.nameOfZoo,
      locationOfZoo: this.locationOfZoo
    }).subscribe({
      next: zoo => {
        this.zoos.push(zoo);
        this.nameOfZoo = '';
        this.locationOfZoo = '';
        this.loading = false;
      },
      error: () => {
        this.error = 'Error creating zoo';
        this.loading = false;
      }
    });
  }

  getBirdsForZoo(zooId: number): Bird[] {
    return this.birds.filter(bird => bird.zooId === zooId);
  }
}