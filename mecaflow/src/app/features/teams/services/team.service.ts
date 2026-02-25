import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateUserPayload, Team, TeamMember } from '../models/team.model';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/teams`;
  private readonly USERS_API = `${environment.apiUrl}/users`;

  // Teams
  getAllTeams(): Observable<ReadonlyArray<Team>> {
    return this.http.get<ReadonlyArray<Team>>(this.API);
  }

  createTeam(team: Partial<Team>): Observable<Team> {
    return this.http.post<Team>(this.API, team);
  }

  updateTeam(id: string, data: Partial<Team>): Observable<Team> {
    return this.http.patch<Team>(`${this.API}/${id}`, data);
  }

  deleteTeam(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  addMember(teamId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.API}/${teamId}/members`, { userId });
  }

  removeMember(teamId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${teamId}/members/${userId}`);
  }

  // Users
  getAllUsers(): Observable<ReadonlyArray<TeamMember>> {
    return this.http.get<ReadonlyArray<TeamMember>>(this.USERS_API);
  }

  createUser(payload: CreateUserPayload): Observable<TeamMember> {
    return this.http.post<TeamMember>(this.USERS_API, payload);
  }

  updateUserRole(userId: string, role: string): Observable<TeamMember> {
    return this.http.patch<TeamMember>(`${this.USERS_API}/${userId}/role`, { role });
  }

  deactivateUser(userId: string): Observable<TeamMember> {
    return this.http.patch<TeamMember>(`${this.USERS_API}/${userId}/deactivate`, {});
  }

  activateUser(userId: string): Observable<TeamMember> {
    return this.http.patch<TeamMember>(`${this.USERS_API}/${userId}/activate`, {});
  }
}
