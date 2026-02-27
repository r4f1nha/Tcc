import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Automation, AutomationLog } from '../models/automation.model';

@Injectable({ providedIn: 'root' })
export class AutomationService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/automations`;

  getAll(): Observable<ReadonlyArray<Automation>> {
    return this.http.get<ReadonlyArray<Automation>>(this.API);
  }

  getById(id: string): Observable<Automation> {
    return this.http.get<Automation>(`${this.API}/${id}`);
  }

  create(automation: Partial<Automation>): Observable<Automation> {
    return this.http.post<Automation>(this.API, automation);
  }

  update(id: string, data: Partial<Automation>): Observable<Automation> {
    return this.http.patch<Automation>(`${this.API}/${id}`, data);
  }

  toggleActive(id: string, active: boolean): Observable<Automation> {
    return this.http.patch<Automation>(`${this.API}/${id}/toggle`, { active });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  getLogs(automationId: string): Observable<ReadonlyArray<AutomationLog>> {
    return this.http.get<ReadonlyArray<AutomationLog>>(`${this.API}/${automationId}/logs`);
  }
}
