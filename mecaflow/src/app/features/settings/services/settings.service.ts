import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { NotificationSettings, WorkshopSettings } from '../models/settings.model';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/settings`;

  getWorkshopSettings(): Observable<WorkshopSettings> {
    return this.http.get<WorkshopSettings>(`${this.API}/workshop`);
  }

  updateWorkshopSettings(data: Partial<WorkshopSettings>): Observable<WorkshopSettings> {
    return this.http.patch<WorkshopSettings>(`${this.API}/workshop`, data);
  }

  getNotificationSettings(): Observable<NotificationSettings> {
    return this.http.get<NotificationSettings>(`${this.API}/notifications`);
  }

  updateNotificationSettings(data: Partial<NotificationSettings>): Observable<NotificationSettings> {
    return this.http.patch<NotificationSettings>(`${this.API}/notifications`, data);
  }
}
