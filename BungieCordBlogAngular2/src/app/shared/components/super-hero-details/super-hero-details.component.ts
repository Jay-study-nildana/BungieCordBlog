import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
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

interface OrderBasket {
  id: string;
  userId: string;
  createdDate: string;
  updatedDate: string;
  items: any[];
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

  // Cart controls
  quantity: number = 1;
  cartLoading = false;
  cartMessage: string = '';
  cartSuccess: boolean = false;
  showCartMessage = false;

  orderBasketId: string = '';
  token: string = '';
  userId: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private powerService: SuperPowerService,
    private sidekickService: SidekickService,
    private imagesService: SuperHeroImagesService
  ) {}

  ngOnInit() {
    // Get token from cookie
    this.token = this.cookieService.get('Authorization');

    // Get userId using token
    if (this.token) {
      const headers = new HttpHeaders().set('Authorization', this.token);
      this.http.get<{ userId: string }>('https://localhost:7226/api/Auth/me/guid', { headers })
        .subscribe({
          next: (data) => {
            this.userId = data.userId;
            // Get orderBasketId using userId
            this.http.get<OrderBasket>(`https://localhost:7226/api/Payment/orderbasket/by-user/${this.userId}`, { headers })
              .subscribe({
                next: (basket) => {
                  this.orderBasketId = basket.id;
                },
                error: () => {
                  this.orderBasketId = '';
                }
              });
          },
          error: () => {
            this.userId = '';
          }
        });
    }

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

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart() {
    if (!this.productStock || !this.orderBasketId) return;
    this.cartLoading = true;
    this.showCartMessage = false;
    const payload = {
      orderBasketId: this.orderBasketId,
      productId: this.productStock.id,
      quantity: this.quantity,
      unitPrice: this.productStock.unitPrice
    };
    this.http.post('https://localhost:7226/api/Payment/orderbasketitem', payload)
      .subscribe({
        next: () => {
          this.cartMessage = 'Added to cart successfully!';
          this.cartSuccess = true;
          this.showCartMessage = true;
          this.cartLoading = false;
          setTimeout(() => this.showCartMessage = false, 2000);
        },
        error: () => {
          this.cartMessage = 'Failed to add to cart.';
          this.cartSuccess = false;
          this.showCartMessage = true;
          this.cartLoading = false;
          setTimeout(() => this.showCartMessage = false, 2000);
        }
      });
  }
}