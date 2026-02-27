import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DashboardMetrics, KpiCard, MetricPeriod } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  getMetrics(period: MetricPeriod): Observable<DashboardMetrics> {
    const params = new HttpParams().set('period', period);
    return this.http.get<DashboardMetrics>(this.baseUrl, { params });
  }

  getKpis(period: MetricPeriod): Observable<ReadonlyArray<KpiCard>> {
    const params = new HttpParams().set('period', period);
    return this.http.get<ReadonlyArray<KpiCard>>(`${this.baseUrl}/kpis`, { params });
  }
}
