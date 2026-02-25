import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { KanbanFilters, ServiceOrder, ServiceOrderStatus } from '../models/kanban.model';

@Injectable({ providedIn: 'root' })
export class KanbanService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/service-orders`;

  getAll(filters: KanbanFilters): Observable<ReadonlyArray<ServiceOrder>> {
    let params = new HttpParams();
    if (filters.agentId) params = params.set('agentId', filters.agentId);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.overdueOnly) params = params.set('overdueOnly', 'true');
    return this.http.get<ReadonlyArray<ServiceOrder>>(this.API, { params });
  }

  getById(id: string): Observable<ServiceOrder> {
    return this.http.get<ServiceOrder>(`${this.API}/${id}`);
  }

  create(order: Partial<ServiceOrder>): Observable<ServiceOrder> {
    return this.http.post<ServiceOrder>(this.API, order);
  }

  update(id: string, data: Partial<ServiceOrder>): Observable<ServiceOrder> {
    return this.http.patch<ServiceOrder>(`${this.API}/${id}`, data);
  }

  moveToColumn(id: string, newStatus: ServiceOrderStatus): Observable<ServiceOrder> {
    return this.http.patch<ServiceOrder>(`${this.API}/${id}/status`, { status: newStatus });
  }
}
