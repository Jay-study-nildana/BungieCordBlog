import { Component, OnInit } from '@angular/core';
import { ProductUserInfoService, ProductUserInfo } from 'src/app/shared/services/product-user-info.service';
import { NotificationService } from 'src/app/features/auth/services/auth.NotificationService';

@Component({
  selector: 'app-product-user-table',
  templateUrl: './product-user-table.component.html'
})
export class ProductUserTableComponent implements OnInit {
  productUsers: ProductUserInfo[] = [];
  loading = false;
  error = '';
  editRowId: string | null = null;
  editNotes: string = '';
  editIsActive: boolean = true;

  constructor(
    private productUserInfoService: ProductUserInfoService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadProductUsers();
  }

  loadProductUsers() {
    this.loading = true;
    this.productUserInfoService.getAll().subscribe({
      next: (data) => {
        this.productUsers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product user info.';
        this.loading = false;
      }
    });
  }

  startEdit(row: ProductUserInfo) {
    this.editRowId = row.id;
    this.editNotes = row.notes;
    this.editIsActive = row.isActive;
  }

  cancelEdit() {
    this.editRowId = null;
    this.editNotes = '';
    this.editIsActive = true;
  }

  saveEdit(row: ProductUserInfo) {
    this.productUserInfoService.update(row.id, {
      notes: this.editNotes,
      isActive: this.editIsActive
    }).subscribe({
      next: (updated) => {
        this.notificationService.show('Product User Info updated successfully!');
        this.loadProductUsers();
        this.cancelEdit();
      },
      error: (err) => {
        this.notificationService.show('Failed to update Product User Info.');
      }
    });
  }
}