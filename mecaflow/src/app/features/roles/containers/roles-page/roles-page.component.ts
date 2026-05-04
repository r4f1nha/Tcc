import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesService } from '../../services/roles.service';
import { RolePermission } from '../../models/role-permission.model';

type RoleName = 'OWNER' | 'ADMIN' | 'AGENT';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles-page.component.html',
  styleUrls: ['./roles-page.component.scss'],
})
export class RolesPageComponent {
  selectedRole: RoleName | null = null;
  permissions: RolePermission[] = [];
  loading = false;

  roles: { name: RoleName; description: string }[] = [
    {
      name: 'OWNER',
      description: 'Dono da conta. Possui acesso total ao sistema.',
    },
    {
      name: 'ADMIN',
      description: 'Administrador. Gerencia operação, usuários e configurações.',
    },
    {
      name: 'AGENT',
      description: 'Atendente. Acessa módulos operacionais do CRM.',
    },
  ];

  constructor(private rolesService: RolesService) {}

  openRole(role: RoleName): void {
    this.selectedRole = role;
    this.permissions = [];
    this.loading = true;

    this.rolesService.getPermissions(role).subscribe({
      next: (res) => {
        console.log('Permissões recebidas:', res);
        this.permissions = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar permissões:', err);
        this.loading = false;
      },
    });
  }

  closeModal(): void {
    this.selectedRole = null;
    this.permissions = [];
    this.loading = false;
  }

  togglePermission(name: string): void {
    this.permissions = this.permissions.map((perm) =>
      perm.name === name
        ? { ...perm, enabled: !perm.enabled }
        : perm
    );
  }

  save(): void {
    if (!this.selectedRole) return;

    this.rolesService
      .savePermissions(this.selectedRole, this.permissions)
      .subscribe({
        next: () => {
          console.log('Permissões salvas com sucesso');
          this.closeModal();
        },
        error: (err) => {
          console.error('Erro ao salvar permissões:', err);
        },
      });
  }
}