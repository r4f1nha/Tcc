import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateLeadPayload,
  Lead,
  LeadFilters,
  LeadImportResult,
  PaginatedResponse,
} from '../models/lead.model';

@Injectable({ providedIn: 'root' })
export class LeadService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/leads`;

  getAll(filters: LeadFilters): Observable<PaginatedResponse<Lead>> {
    const params = this.buildParams(filters);
    return this.http.get<PaginatedResponse<Lead>>(this.API, { params });
  }

  getById(id: string): Observable<Lead> {
    return this.http.get<Lead>(`${this.API}/${id}`);
  }

  create(payload: CreateLeadPayload): Observable<Lead> {
    return this.http.post<Lead>(this.API, payload);
  }

  update(id: string, payload: Partial<CreateLeadPayload>): Observable<Lead> {
    return this.http.patch<Lead>(`${this.API}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  importFromCsv(file: File): Observable<LeadImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<LeadImportResult>(`${this.API}/import`, formData);
  }

  exportToCsv(filters: LeadFilters): Observable<Blob> {
    const params = this.buildParams(filters);
    return this.http.get(`${this.API}/export`, {
      params,
      responseType: 'blob',
    });
  }

  private buildParams(filters: LeadFilters): HttpParams {
    let params = new HttpParams()
      .set('page', filters.page.toString())
      .set('pageSize', filters.pageSize.toString());

    if (filters.search) params = params.set('search', filters.search);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.labelId) params = params.set('labelId', filters.labelId);
    if (filters.agentId) params = params.set('agentId', filters.agentId);
    if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params = params.set('dateTo', filters.dateTo);

    return params;
  }
}
