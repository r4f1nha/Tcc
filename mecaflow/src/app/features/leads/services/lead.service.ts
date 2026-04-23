import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateLeadPayload, Lead } from '../models/lead.model';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/leads';

  list(): Observable<Lead[]> {
    return this.http.get<Lead[]>(this.apiUrl);
  }

  getById(id: number): Observable<Lead> {
    return this.http.get<Lead>(`${this.apiUrl}/${id}`);
  }

  create(payload: CreateLeadPayload): Observable<Lead> {
    return this.http.post<Lead>(this.apiUrl, payload);
  }

  update(id: number, payload: CreateLeadPayload): Observable<Lead> {
    return this.http.put<Lead>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}