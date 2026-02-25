import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { KnowledgeEntry, KnowledgeFilters } from '../models/knowledge-base.model';

@Injectable({ providedIn: 'root' })
export class KnowledgeBaseService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/knowledge-base`;

  getAll(filters: KnowledgeFilters): Observable<ReadonlyArray<KnowledgeEntry>> {
    let params = new HttpParams();
    if (filters.search) params = params.set('search', filters.search);
    if (filters.category) params = params.set('category', filters.category);
    return this.http.get<ReadonlyArray<KnowledgeEntry>>(this.API, { params });
  }

  getById(id: string): Observable<KnowledgeEntry> {
    return this.http.get<KnowledgeEntry>(`${this.API}/${id}`);
  }

  create(entry: Partial<KnowledgeEntry>): Observable<KnowledgeEntry> {
    return this.http.post<KnowledgeEntry>(this.API, entry);
  }

  update(id: string, entry: Partial<KnowledgeEntry>): Observable<KnowledgeEntry> {
    return this.http.patch<KnowledgeEntry>(`${this.API}/${id}`, entry);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
