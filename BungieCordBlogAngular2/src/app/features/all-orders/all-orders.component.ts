import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Order {
  id: string;
  userId: string;
  email: string;
  paymentId: string;
  status: number;
  createdDate: string;
  updatedDate: string;
  statusString: string;
}

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html'
})
export class AllOrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  isEditing = false;
  loading = false;
  error = '';
  success = '';
  detailsOrderId: string | null = null;
  detailsOrder: Order | null = null;
  loadingDetails = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.http.get<Order[]>('https://localhost:7226/api/Payment/orders')
      .subscribe({
        next: data => {
          this.orders = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load orders.';
          this.loading = false;
        }
      });
  }

  selectOrder(order: Order) {
    this.selectedOrder = { ...order };
    this.isEditing = true;
    this.success = '';
    this.error = '';
  }

  newOrder() {
    // Not supported for orders, just placeholder
    this.selectedOrder = null;
    this.isEditing = false;
    this.success = '';
    this.error = '';
  }

  saveOrder() {
    if (this.selectedOrder?.id && this.isEditing) {
      const updatePayload = {
        Status: this.selectedOrder.status
      };
      this.http.put<Order>(
        `https://localhost:7226/api/Payment/order/${this.selectedOrder.id}`,
        updatePayload
      ).subscribe({
        next: () => {
          this.success = 'Order status updated successfully!';
          this.selectedOrder = null;
          this.loadOrders();
        },
        error: () => {
          this.error = 'Failed to update order status.';
        }
      });
    }
  }

  deleteOrder(id: string) {
    // Not supported for orders, just placeholder
    this.success = 'Delete not implemented for orders.';
  }

  cancel() {
    this.selectedOrder = null;
    this.success = '';
    this.error = '';
  }

  toggleDetails(orderId: string) {
    if (this.detailsOrderId === orderId) {
      this.detailsOrderId = null;
      this.detailsOrder = null;
      return;
    }
    this.detailsOrderId = orderId;
    this.loadingDetails = true;
    this.http.get<Order>(`https://localhost:7226/api/Payment/order/${orderId}`)
      .subscribe({
        next: order => {
          this.detailsOrder = order;
          this.loadingDetails = false;
        },
        error: () => {
          this.detailsOrder = null;
          this.loadingDetails = false;
        }
      });
  }
}