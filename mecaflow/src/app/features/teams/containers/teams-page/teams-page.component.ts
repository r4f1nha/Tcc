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
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Times e Usuários</h1>
          <p class="text-sm text-slate-400 mt-1">Gerencie equipes e permissões</p>
        </div>
        <button class="px-4 py-2 bg-[#4F6EF7] hover:bg-[#3d5ae0] text-white text-sm font-medium rounded-lg transition-colors">
          + Novo Usuário
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-slate-700/50">
        <button
          (click)="activeTab.set('users')"
          [class]="activeTab() === 'users' ? 'text-[#4F6EF7] border-[#4F6EF7]' : 'text-slate-400 border-transparent'"
          class="px-4 py-3 text-sm font-medium border-b-2 transition-all">
          Usuários
        </button>
        <button
          (click)="activeTab.set('teams')"
          [class]="activeTab() === 'teams' ? 'text-[#4F6EF7] border-[#4F6EF7]' : 'text-slate-400 border-transparent'"
          class="px-4 py-3 text-sm font-medium border-b-2 transition-all">
          Times
        </button>
      </div>

      @if (loading()) {
        <app-skeleton variant="card" />
      } @else if (activeTab() === 'users') {
        <!-- Users Table -->
        <div class="bg-[#22263a] rounded-xl border border-slate-700/50 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-700/50 text-xs text-slate-400 uppercase tracking-wider">
                <th class="px-4 py-3 text-left font-medium">Nome</th>
                <th class="px-4 py-3 text-left font-medium">Email</th>
                <th class="px-4 py-3 text-left font-medium">Role</th>
                <th class="px-4 py-3 text-left font-medium">Status</th>
                <th class="px-4 py-3 text-left font-medium">Último acesso</th>
                <th class="px-4 py-3 text-left font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr class="border-b border-slate-700/30 hover:bg-[#1a1d27] transition-colors">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-[#4F6EF7]/20 flex items-center justify-center text-xs font-bold text-[#4F6EF7]">
                        {{ user.name.charAt(0).toUpperCase() }}
                      </div>
                      <span class="text-white font-medium">{{ user.name }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-slate-400 text-xs">{{ user.email }}</td>
                  <td class="px-4 py-3">
                    <span class="text-xs px-2 py-0.5 rounded-full" [class]="getRoleBadge(user.role)">
                      {{ getRoleLabel(user.role) }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="flex items-center gap-1.5 text-xs">
                      <div class="w-2 h-2 rounded-full"
                        [class]="user.status === MemberStatus.ACTIVE ? 'bg-emerald-500' : 'bg-slate-500'"></div>
                      {{ user.status === MemberStatus.ACTIVE ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-slate-500 text-xs font-mono">
                    {{ user.lastAccessAt ? (user.lastAccessAt | date:'dd/MM/yyyy HH:mm') : 'Nunca' }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex gap-2">
                      <button class="text-xs text-[#4F6EF7] hover:text-[#3d5ae0]">Editar</button>
                      @if (user.status === MemberStatus.ACTIVE) {
                        <button (click)="onDeactivateUser(user.id)" class="text-xs text-red-400 hover:text-red-300">Desativar</button>
                      } @else {
                        <button (click)="onActivateUser(user.id)" class="text-xs text-emerald-400 hover:text-emerald-300">Ativar</button>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <!-- Teams Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (team of teams(); track team.id) {
            <div class="bg-[#22263a] rounded-xl border border-slate-700/50 p-5 hover:border-[#4F6EF7]/30 transition-all">
              <h3 class="text-sm font-semibold text-white mb-1">{{ team.name }}</h3>
              <p class="text-xs text-slate-400 mb-3">{{ team.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-500">{{ team.memberCount }} membro(s)</span>
                <button class="text-xs text-[#4F6EF7] hover:text-[#3d5ae0]">Gerenciar</button>
              </div>
            </div>
          } @empty {
            <div class="col-span-3 text-center py-12 text-slate-500 text-sm">Nenhum time criado</div>
          }
        </div>
      }
    </div>
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
      [UserRole.OWNER]: 'bg-purple-500/10 text-purple-400',
      [UserRole.ADMIN]: 'bg-[#4F6EF7]/10 text-[#4F6EF7]',
      [UserRole.AGENT]: 'bg-slate-500/10 text-slate-400',
    };
    return map[role];
  }
}
