import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

export interface ProductUserInfo {
  id: string;
  productId: string;
  userId: string;
  email: string;
  addedDate: string;
  isActive: boolean;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductUserInfoService {
  private apiUrl = 'https://localhost:7226/api/ProductUserInfo';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('Authorization');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'accept': '*/*'
    });
  }

  getAll(): Observable<ProductUserInfo[]> {
    return this.http.get<ProductUserInfo[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  update(id: string, data: { notes: string; isActive: boolean }): Observable<ProductUserInfo> {
    return this.http.put<ProductUserInfo>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }
}