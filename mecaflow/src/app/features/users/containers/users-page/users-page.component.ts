import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TeamService } from '../../services/user.service';
import { Team, TeamMember } from '../../models/user.model';
import { UserRole } from '../../../../core/auth/models/user.model';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row mb-1">
      <div class="col-12">
        <div class="content-header d-flex align-items-center justify-content-between">
          <div>
            <i class="fas fa-users header-icon"></i>&nbsp;Usuários
          </div>

          <button class="btn btn-primary btn-sm" (click)="showCreateUserModal.set(true)">
            <i class="fas fa-plus mr-1"></i>Novo Usuário
          </button>
        </div>
      </div>
    </div>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a class="nav-link" [class.active]="activeTab() === 'users'" (click)="activeTab.set('users')">
          Usuários
        </a>
      </li>
    </ul>

    @if (loading()) {
      <app-skeleton />
    } @else if (activeTab() === 'users') {

      <table class="table table-sm">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          @for (user of users(); track user.id) {
            <tr>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.active ? 'Ativo' : 'Inativo' }}</td>

              <td>
                <button class="btn btn-sm btn-primary" (click)="onEditUser(user)">Editar</button>

                @if (user.active) {
                  <button class="btn btn-sm btn-warning" (click)="onDeactivateUser(user.id)">Desativar</button>
                } @else {
                  <button class="btn btn-sm btn-success" (click)="onActivateUser(user.id)">Ativar</button>
                }

                <button class="btn btn-sm btn-danger" (click)="onDeleteUser(user.id)">Excluir</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    }

    <!-- MODAL CRIAR -->
    @if (showCreateUserModal()) {
      <div class="modal d-block" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">

            <div class="modal-header">
              <h5>Novo Usuário</h5>
              <button (click)="showCreateUserModal.set(false)">X</button>
            </div>

            <div class="modal-body">
              <input class="form-control mb-2" placeholder="Nome" #name>
              <input class="form-control mb-2" placeholder="Email" #email>
              <input class="form-control mb-2" type="password" placeholder="Senha" #password>

              <select class="form-control" #role>
                <option value="AGENT">Agente</option>
                <option value="ADMIN">Admin</option>
                <option value="OWNER">Owner</option>
              </select>
            </div>

            <div class="modal-footer">
              <button (click)="showCreateUserModal.set(false)">Cancelar</button>

              <button
                (click)="createUserFromModal(name.value, email.value, password.value, role.value)">
                Criar
              </button>
            </div>

          </div>
        </div>
      </div>
    }

    <!-- MODAL EDITAR -->
    @if (showEditUserModal() && selectedUser()) {
      <div class="modal d-block" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">

            <div class="modal-header">
              <h5>Editar Usuário</h5>
              <button (click)="showEditUserModal.set(false)">X</button>
            </div>

            <div class="modal-body">
              <input class="form-control mb-2" #editName [value]="selectedUser()!.name">
              <input class="form-control mb-2" #editEmail [value]="selectedUser()!.email">
              <input
  class="form-control mb-2"
  type="password"
  placeholder="Nova senha (opcional)"
  #editPassword
>

              <select class="form-control" #editRole>
                <option [selected]="selectedUser()!.role === 'AGENT'" value="AGENT">Agente</option>
                <option [selected]="selectedUser()!.role === 'ADMIN'" value="ADMIN">Admin</option>
                <option [selected]="selectedUser()!.role === 'OWNER'" value="OWNER">Owner</option>
              </select>
            </div>

            <div class="modal-footer">
              <button (click)="showEditUserModal.set(false)">Cancelar</button>

              <button
                (click)="updateUserFromModal(
  selectedUser()!.id,
  editName.value,
  editEmail.value,
  editRole.value,
  editPassword.value
)">
                Salvar
              </button>
            </div>

          </div>
        </div>
      </div>
    }
  `,
})
export class TeamsPageComponent implements OnInit {

  private readonly teamService = inject(TeamService);

  readonly users = signal<ReadonlyArray<TeamMember>>([]);
  readonly loading = signal(true);

  readonly activeTab = signal<'users' | 'teams'>('users');

  readonly showCreateUserModal = signal(false);
  readonly showEditUserModal = signal(false);
  readonly selectedUser = signal<TeamMember | null>(null);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.teamService.getAllUsers().subscribe(data => {
      this.users.set(data);
      this.loading.set(false);
    });
  }

  createUserFromModal(name: string, email: string, password: string, role: string) {

    const payload = {
      name,
      email,
      phone: '',
      role: role as UserRole,
      password,
      teamIds: [],
    };

    this.teamService.createUser(payload).subscribe(() => {
      this.showCreateUserModal.set(false);
      this.loadUsers();
    });
  }

  onEditUser(user: TeamMember) {
    this.selectedUser.set(user);
    this.showEditUserModal.set(true);
  }

  updateUserFromModal(
  id: string,
  name: string,
  email: string,
  role: string,
  password: string
) {

  const payload = {
    name,
    email,
    phone: '',
    role: role as UserRole,
    password: password || undefined,
    teamIds: [],
  };

  this.teamService.updateUser(id, payload).subscribe(() => {
    this.showEditUserModal.set(false);
    this.loadUsers();
  });
}

  onDeactivateUser(id: string) {
    this.teamService.deactivateUser(id).subscribe(() => this.loadUsers());
  }

  onActivateUser(id: string) {
    this.teamService.activateUser(id).subscribe(() => this.loadUsers());
  }

  onDeleteUser(id: string) {
    if (!confirm('Excluir usuário?')) return;

    this.teamService.deleteUser(id).subscribe(() => this.loadUsers());
  }
}