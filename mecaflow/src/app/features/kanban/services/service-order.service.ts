import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ServiceOrder,
  ServiceOrderKanbanResponse,
  ServiceOrderStatus,
} from '../models/service-order';

@Injectable({
  providedIn: 'root',
})
export class ServiceOrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/service-orders';

  getAll(
    filters?: Record<string, string | number | boolean | null | undefined>,
  ): Observable<ServiceOrder[]> {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, String(value));
        }
      });
    }

    return this.http.get<ServiceOrder[]>(this.apiUrl, { params });
  }

  list(): Observable<ServiceOrder[]> {
    return this.getAll();
  }

  getKanban(): Observable<ServiceOrderKanbanResponse> {
    return this.http.get<ServiceOrderKanbanResponse>(`${this.apiUrl}/kanban`);
  }

  getById(id: number): Observable<ServiceOrder> {
    return this.http.get<ServiceOrder>(`${this.apiUrl}/${id}`);
  }

  create(payload: Partial<ServiceOrder>): Observable<ServiceOrder> {
    return this.http.post<ServiceOrder>(this.apiUrl, payload);
  }

  update(id: number, payload: Partial<ServiceOrder>): Observable<ServiceOrder> {
    return this.http.put<ServiceOrder>(`${this.apiUrl}/${id}`, payload);
  }

  updateStatus(id: number, status: ServiceOrderStatus): Observable<ServiceOrder> {
    return this.http.patch<ServiceOrder>(`${this.apiUrl}/${id}/status`, {
      status,
    });
  }

  moveToColumn(id: number, status: ServiceOrderStatus): Observable<ServiceOrder> {
    return this.updateStatus(id, status);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}