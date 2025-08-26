import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

interface OrderBasketItem {
  id: string;
  orderBasketId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  addedDate: string;
}

interface OrderBasket {
  id: string;
  userId: string;
  createdDate: string;
  updatedDate: string;
  items: OrderBasketItem[];
}

@Component({
  selector: 'app-order-basket',
  templateUrl: './order-basket.component.html'
})
export class OrderBasketComponent implements OnInit {
  basket: OrderBasket | null = null;
  loading = false;
  error = '';
  userId: string | null = null;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  ngOnInit() {
    this.loading = true;
    const token = this.cookieService.get('Authorization');
    const headers = new HttpHeaders({
      'Authorization': `${token}`,
      'accept': '*/*'
    });

    // Step 1: Get userId
    this.http.get<{ userId: string }>('https://localhost:7226/api/Auth/me/guid', { headers })
      .subscribe({
        next: userData => {
          this.userId = userData.userId;
          // Step 2: Get basket by userId
          this.http.get<OrderBasket>(`https://localhost:7226/api/Payment/orderbasket/by-user/${this.userId}`, { headers })
            .subscribe({
              next: basketData => {
                this.basket = basketData;
                this.loading = false;
              },
              error: () => {
                this.error = 'Could not load order basket.';
                this.loading = false;
              }
            });
        },
        error: () => {
          this.error = 'Could not retrieve user information.';
          this.loading = false;
        }
      });
  }
}