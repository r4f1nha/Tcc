import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TeamService } from '../../services/team.service';
import { MemberStatus, Team, TeamMember } from '../../models/team.model';
import { UserRole } from '../../../../core/auth/models/user.model';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [DatePipe, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Cabeçalho -->
    <div class="row mb-1">
      <div class="col-12">
        <div class="content-header d-flex align-items-center justify-content-between">
          <div>
            <i class="fas fa-users header-icon"></i>&nbsp;Times e Usuários
          </div>
          <button class="btn btn-primary btn-sm">
            <i class="fas fa-plus mr-1"></i>Novo Usuário
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a class="nav-link" href="javascript:void(0)"
          [class.active]="activeTab() === 'users'"
          (click)="activeTab.set('users')">
          <i class="fas fa-user mr-1"></i>Usuários
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript:void(0)"
          [class.active]="activeTab() === 'teams'"
          (click)="activeTab.set('teams')">
          <i class="fas fa-users mr-1"></i>Times
        </a>
      </li>
    </ul>

    @if (loading()) {
      <app-skeleton variant="card" />
    } @else if (activeTab() === 'users') {
      <!-- Users Table -->
      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover table-sm mb-0">
              <thead class="thead-light">
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Último acesso</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                @for (user of users(); track user.id) {
                  <tr>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="rounded-circle d-flex align-items-center justify-content-center mr-2 font-weight-700"
                          style="width:32px;height:32px;background:rgba(79,110,247,0.15);color:#4F6EF7;font-size:0.75rem;flex-shrink:0;">
                          {{ user.name.charAt(0).toUpperCase() }}
                        </div>
                        <span class="font-weight-600">{{ user.name }}</span>
                      </div>
                    </td>
                    <td class="text-muted" style="font-size:0.8rem;">{{ user.email }}</td>
                    <td>
                      <span class="badge badge-pill" [class]="getRoleBadge(user.role)">
                        {{ getRoleLabel(user.role) }}
                      </span>
                    </td>
                    <td>
                      <span class="d-flex align-items-center" style="font-size:0.8rem;">
                        <span class="rounded-circle mr-1" style="width:8px;height:8px;display:inline-block;"
                          [style.background]="user.status === MemberStatus.ACTIVE ? '#28C76F' : '#6c757d'"></span>
                        {{ user.status === MemberStatus.ACTIVE ? 'Ativo' : 'Inativo' }}
                      </span>
                    </td>
                    <td class="text-muted" style="font-size:0.8rem;">
                      {{ user.lastAccessAt ? (user.lastAccessAt | date:'dd/MM/yyyy HH:mm') : 'Nunca' }}
                    </td>
                    <td>
                      <button class="btn btn-link btn-sm text-primary p-0 mr-2">Editar</button>
                      @if (user.status === MemberStatus.ACTIVE) {
                        <button class="btn btn-link btn-sm text-danger p-0" (click)="onDeactivateUser(user.id)">Desativar</button>
                      } @else {
                        <button class="btn btn-link btn-sm text-success p-0" (click)="onActivateUser(user.id)">Ativar</button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    } @else {
      <!-- Teams Grid -->
      <div class="row">
        @for (team of teams(); track team.id) {
          <div class="col-lg-4 col-md-6 mb-3">
            <div class="card h-100">
              <div class="card-body">
                <h6 class="card-title font-weight-600">{{ team.name }}</h6>
                <p class="card-text text-muted" style="font-size:0.8rem;">{{ team.description }}</p>
              </div>
              <div class="card-footer d-flex align-items-center justify-content-between py-2">
                <small class="text-muted">{{ team.memberCount }} membro(s)</small>
                <button class="btn btn-link btn-sm text-primary p-0">Gerenciar</button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-12">
            <div class="card">
              <div class="card-body text-center text-muted py-5">Nenhum time criado</div>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class TeamsPageComponent implements OnInit {
  private readonly teamService = inject(TeamService);

  readonly users = signal<ReadonlyArray<TeamMember>>([]);
  readonly teams = signal<ReadonlyArray<Team>>([]);
  readonly loading = signal(true);
  readonly activeTab = signal<'users' | 'teams'>('users');
  protected readonly MemberStatus = MemberStatus;

  ngOnInit(): void {
    this.teamService.getAllUsers().subscribe({
      next: (data) => { this.users.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
    this.teamService.getAllTeams().subscribe((data) => this.teams.set(data));
  }

  onDeactivateUser(userId: string): void {
    this.teamService.deactivateUser(userId).subscribe((updated) =>
      this.users.update((list) => list.map((u) => u.id === updated.id ? updated : u)),
    );
  }

  onActivateUser(userId: string): void {
    this.teamService.activateUser(userId).subscribe((updated) =>
      this.users.update((list) => list.map((u) => u.id === updated.id ? updated : u)),
    );
  }

  getRoleLabel(role: UserRole): string {
    const map: Record<UserRole, string> = {
      [UserRole.OWNER]: 'Proprietário',
      [UserRole.ADMIN]: 'Admin',
      [UserRole.AGENT]: 'Agente',
    };
    return map[role];
  }

  getRoleBadge(role: UserRole): string {
    const map: Record<UserRole, string> = {
      [UserRole.OWNER]: 'badge-secondary',
      [UserRole.ADMIN]: 'badge-primary',
      [UserRole.AGENT]: 'badge-light',
    };
    return map[role];
  }
}
