import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Bird {
  id?: number;
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
  selector: 'app-birds',
  templateUrl: './birds.component.html',
  styleUrls: ['./birds.component.css']
})
export class BirdsComponent implements OnInit {
  birds: Bird[] = [];
  zoos: Zoo[] = [];
  loading = false;
  error: string | null = null;

  birdName = '';
  selectedZooId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getBirds();
    this.getZoos();
  }

  getBirds() {
    this.loading = true;
    this.error = null;
    this.http.get<Bird[]>('https://localhost:7226/api/Practice/GetBirds')
      .subscribe({
        next: data => {
          this.birds = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Error loading birds';
          this.loading = false;
        }
      });
  }

  getZoos() {
    this.http.get<Zoo[]>('https://localhost:7226/api/Practice/GetZoos')
      .subscribe({
        next: data => {
          this.zoos = data;
        },
        error: () => {
          this.error = 'Error loading zoos';
        }
      });
  }

  createBird() {
    if (!this.birdName || !this.selectedZooId) return;
    this.loading = true;
    this.error = null;
    this.http.post<Bird>('https://localhost:7226/api/Practice/CreateBird', {
      birdName: this.birdName,
      zooId: this.selectedZooId
    }).subscribe({
      next: bird => {
        this.birds.push(bird);
        this.birdName = '';
        this.selectedZooId = null;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error creating bird';
        this.loading = false;
      }
    });
  }

  getZooName(zooId: number): string {
    const zoo = this.zoos.find(z => z.id === zooId);
    return zoo ? zoo.nameOfZoo : 'Unknown';
  }
}