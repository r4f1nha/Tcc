import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Label, CreateLabelDto } from '../models/label.model';

@Injectable({ providedIn: 'root' })
export class LabelService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/labels`;

  getAll(): Observable<ReadonlyArray<Label>> {
    return this.http.get<ReadonlyArray<Label>>(this.API);
  }

  create(dto: CreateLabelDto): Observable<Label> {
    return this.http.post<Label>(this.API, dto);
  }

  update(id: string, dto: Partial<CreateLabelDto>): Observable<Label> {
    return this.http.patch<Label>(`${this.API}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
