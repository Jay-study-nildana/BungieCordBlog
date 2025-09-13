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

interface PaymentResponse {
  id: string;
  userId: string;
  amount: number;
  method: string;
  status: number;
  transactionId: string;
  createdDate: string;
}

interface CompleteOrderResponse {
  id: string;
  userId: string;
  paymentId: string;
  status: number;
  createdDate: string;
  updatedDate: string;
  items: {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent implements OnInit {
  baskets: OrderBasket[] = [];
  loading = false;
  error = '';
  totalAmount: number = 0;

  // Dummy card fields
  cardNumber: string = '';
  expiry: string = '';
  cvv: string = '';
  nameOnCard: string = '';

  payLoading = false;
  payError = '';
  payResult: PaymentResponse | null = null;

  userId: string = '';
  completeOrderLoading = false;
  completeOrderError = '';
  completeOrderResult: CompleteOrderResponse | null = null;

  // Timer for auto-confirm
  confirmTimer: number = 5; // seconds
  timerActive: boolean = false;
  timerInterval: any;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

ngOnInit() {
  this.loading = true;
  const token = this.cookieService.get('Authorization');

  // Get userId using token
  this.http.get<{ userId: string }>('https://localhost:7226/api/Auth/me/guid', {
    headers: {
      'accept': '*/*',
      'Authorization': `${token}`
    }
  }).subscribe({
    next: (data) => {
      this.userId = data.userId;

      // Now load order baskets
      this.http.get<OrderBasket[]>('https://localhost:7226/api/Payment/orderbaskets', {
        headers: {
          'accept': '*/*',
          'Authorization': `${token}`
        }
      }).subscribe({
        next: (baskets) => {
          this.baskets = baskets;
          this.totalAmount = this.calculateTotal(baskets);
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load basket contents.';
          this.loading = false;
        }
      });
    },
    error: () => {
      this.error = 'Could not get userId.';
      this.loading = false;
    }
  });
}

  calculateTotal(baskets: OrderBasket[]): number {
    let sum = 0;
    baskets.forEach(basket => {
      basket.items.forEach(item => {
        sum += item.unitPrice * item.quantity;
      });
    });
    return sum;
  }

  pay() {
    this.payError = '';
    this.payResult = null;
    this.payLoading = true;

    const token = this.cookieService.get('Authorization');
    const paymentPayload = {
      userId: this.userId,
      amount: this.totalAmount,
      method: 'CreditCard',
      status: 1,
      transactionId: 'dummy-tx-' + Date.now()
    };

    this.http.post<PaymentResponse>('https://localhost:7226/api/Payment/payment', paymentPayload, {
      headers: {
        'accept': '*/*',
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
      }
    }).subscribe({
      next: (result) => {
        this.payResult = result;
        this.payLoading = false;
        this.startConfirmTimer();
      },
      error: () => {
        this.payError = 'Payment failed. Please try again.';
        this.payLoading = false;
      }
    });
  }

  startConfirmTimer() {
    this.confirmTimer = 5;
    this.timerActive = true;
    this.timerInterval = setInterval(() => {
      this.confirmTimer--;
      if (this.confirmTimer <= 0) {
        clearInterval(this.timerInterval);
        this.timerActive = false;
        this.confirmOrder();
      }
    }, 1000);
  }

  confirmOrder() {
    if (!this.payResult) return;
    this.completeOrderError = '';
    this.completeOrderResult = null;
    this.completeOrderLoading = true;

    // Stop timer if user clicks manually
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerActive = false;
    }

    const token = this.cookieService.get('Authorization');
    const userId = this.payResult.userId;
    const paymentId = this.payResult.id;

    this.http.post<CompleteOrderResponse>(
      `https://localhost:7226/api/Payment/complete-order?UserId=${userId}&PaymentId=${paymentId}`,
      {},
      {
        headers: {
          'accept': '*/*',
          'Authorization': `${token}`
        }
      }
    ).subscribe({
      next: (result) => {
        this.completeOrderResult = result;
        this.completeOrderLoading = false;
      },
      error: () => {
        this.completeOrderError = 'Order confirmation failed. Please try again.';
        this.completeOrderLoading = false;
      }
    });
  }
}