import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ProductStock {
  id?: string;
  superHeroId: string;
  unitPrice: number;
  quantity: number;
  sku: string;
  description: string;
  currency: string;
  isActive: boolean;
  lastUpdated?: string;
}

interface SuperHero {
  id: string;
  name: string;
  alias: string;
  age: number;
  origin: string;
  firstAppearance: string;
  isActive: boolean;
}

@Component({
  selector: 'app-product-stock',
  templateUrl: './product-stock.component.html'
})
export class ProductStockComponent implements OnInit {
  stocks: ProductStock[] = [];
  selectedStock: ProductStock | null = null;
  isEditing = false;
  loading = false;
  error = '';
  success = '';
  superHeroes: SuperHero[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStocks();
    this.loadSuperHeroes();
  }

  getSuperHeroName(superHeroId: string): string {
  const hero = this.superHeroes.find(h => h.id === superHeroId);
  return hero ? hero.name : superHeroId;
}

  loadStocks() {
    this.loading = true;
    this.http.get<ProductStock[]>('https://localhost:7226/api/ProductStock')
      .subscribe({
        next: data => {
          this.stocks = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load product stock.';
          this.loading = false;
        }
      });
  }

  loadSuperHeroes() {
    this.http.get<SuperHero[]>('https://localhost:7226/api/SuperHeroes')
      .subscribe({
        next: data => {
          this.superHeroes = data;
        },
        error: () => {
          this.error = 'Could not load super heroes.';
        }
      });
  }

  selectStock(stock: ProductStock) {
    this.selectedStock = { ...stock };
    this.isEditing = true;
    this.success = '';
    this.error = '';
  }

  newStock() {
    this.selectedStock = {
      superHeroId: '',
      unitPrice: 0,
      quantity: 0,
      sku: '',
      description: '',
      currency: 'USD',
      isActive: true
    };
    this.isEditing = false;
    this.success = '';
    this.error = '';
  }

  saveStock() {
    if (this.selectedStock?.id && this.isEditing) {
      // PUT for update
      const updatePayload = {
        unitPrice: this.selectedStock.unitPrice,
        quantity: this.selectedStock.quantity,
        sku: this.selectedStock.sku,
        description: this.selectedStock.description,
        currency: this.selectedStock.currency,
        isActive: this.selectedStock.isActive
      };
      this.http.put<ProductStock>(
        `https://localhost:7226/api/ProductStock/${this.selectedStock.id}`,
        updatePayload
      ).subscribe({
        next: () => {
          this.success = 'Product stock updated successfully!';
          this.selectedStock = null;
          this.loadStocks();
        },
        error: () => {
          this.error = 'Failed to update product stock.';
        }
      });
    } else if (this.selectedStock) {
      // POST for create
      this.http.post<ProductStock>('https://localhost:7226/api/ProductStock', this.selectedStock)
        .subscribe({
          next: () => {
            this.success = 'Product stock created successfully!';
            this.selectedStock = null;
            this.loadStocks();
          },
          error: () => {
            this.error = 'Failed to create product stock.';
          }
        });
    }
  }

  deleteStock(id: string) {
    if (!id) return;
    this.http.delete(`https://localhost:7226/api/ProductStock/${id}`, { observe: 'response' })
      .subscribe({
        next: (response) => {
          if (response.status === 204) {
            this.success = 'Product stock deleted successfully!';
            this.loadStocks();
          } else {
            this.error = 'Unexpected response from server.';
          }
        },
        error: () => {
          this.error = 'Failed to delete product stock.';
        }
      });
  }

  cancel() {
    this.selectedStock = null;
    this.success = '';
    this.error = '';
  }
}