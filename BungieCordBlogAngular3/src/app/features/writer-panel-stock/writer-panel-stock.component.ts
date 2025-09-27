import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

export interface SuperHero {
  id: string;
  name: string;
  alias: string;
  age: number;
  origin: string;
  firstAppearance: string;
  isActive: boolean;
}

export interface ProductStock {
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
  selector: 'app-writer-panel-stock',
  templateUrl: './writer-panel-stock.component.html',
})
export class WriterPanelStockComponent implements OnInit {
  superHeroes: SuperHero[] = [];
  selectedStock: ProductStock | null = null;
  editStock: ProductStock | null = null;
  isEditingStock: boolean = false;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  ngOnInit(): void {
    const token = this.cookieService.get('Authorization');
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Authorization': `${token}`,
    });

    this.http.get<SuperHero[]>('https://localhost:7226/api/SuperHeroes/user-superheroes', { headers })
      .subscribe(data => {
        this.superHeroes = data;
      });
  }

  showStockDetails(superHeroId: string): void {
    const token = this.cookieService.get('Authorization');
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Authorization': `${token}`,
    });

    this.http.get<ProductStock>(`https://localhost:7226/api/ProductStock/by-superhero/${superHeroId}`, { headers })
      .subscribe(stock => {
        this.selectedStock = stock;
        this.isEditingStock = false;
        this.editStock = null;
      });
  }

  closeStockDetails(): void {
    this.selectedStock = null;
    this.isEditingStock = false;
    this.editStock = null;
  }

  startEditStock(): void {
    if (this.selectedStock) {
      // Create a copy for editing
      this.editStock = { ...this.selectedStock };
      this.isEditingStock = true;
    }
  }

  updateStock(): void {
    if (!this.editStock) return;
    const token = this.cookieService.get('Authorization');
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `${token}`,
    });

    const payload = {
      unitPrice: this.editStock.unitPrice,
      quantity: this.editStock.quantity,
      sku: this.editStock.sku,
      description: this.editStock.description,
      currency: this.editStock.currency,
      isActive: this.editStock.isActive
    };

    this.http.put<ProductStock>(
      `https://localhost:7226/api/ProductStock/${this.editStock.id}`,
      payload,
      { headers }
    ).subscribe(updatedStock => {
      this.selectedStock = updatedStock;
      this.isEditingStock = false;
      this.editStock = null;
    });
  }

  cancelEditStock(): void {
    this.isEditingStock = false;
    this.editStock = null;
  }
}