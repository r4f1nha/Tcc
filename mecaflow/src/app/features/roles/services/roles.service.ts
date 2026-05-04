import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RolePermission } from '../models/role-permission.model';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private readonly apiUrl = 'http://localhost:8080/api/roles';

  constructor(private http: HttpClient) {}

  getPermissions(role: string): Observable<RolePermission[]> {
    return this.http.get<RolePermission[]>(`${this.apiUrl}/${role}/permissions`);
  }

  savePermissions(role: string, permissions: RolePermission[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${role}/permissions`, permissions);
  }
}