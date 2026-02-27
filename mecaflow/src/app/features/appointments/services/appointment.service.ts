import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Appointment,
  AppointmentFilters,
  BlockedSlot,
  CreateAppointmentPayload,
  TimeSlot,
} from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/appointments`;

  getAll(filters: AppointmentFilters): Observable<ReadonlyArray<Appointment>> {
    let params = new HttpParams().set('date', filters.date);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.agentId) params = params.set('agentId', filters.agentId);
    return this.http.get<ReadonlyArray<Appointment>>(this.API, { params });
  }

  getById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.API}/${id}`);
  }

  create(payload: CreateAppointmentPayload): Observable<Appointment> {
    return this.http.post<Appointment>(this.API, payload);
  }

  update(id: string, payload: Partial<CreateAppointmentPayload>): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.API}/${id}`, payload);
  }

  confirm(id: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.API}/${id}/confirm`, {});
  }

  cancel(id: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.API}/${id}/cancel`, {});
  }

  getAvailableSlots(date: string): Observable<ReadonlyArray<TimeSlot>> {
    const params = new HttpParams().set('date', date);
    return this.http.get<ReadonlyArray<TimeSlot>>(`${this.API}/slots`, { params });
  }

  getBlockedSlots(date: string): Observable<ReadonlyArray<BlockedSlot>> {
    const params = new HttpParams().set('date', date);
    return this.http.get<ReadonlyArray<BlockedSlot>>(`${this.API}/blocked`, { params });
  }
}
