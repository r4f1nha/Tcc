import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/auth/services/auth.service';

interface NavItem {
  readonly label: string;
  readonly route: string;
  readonly icon: string;
  readonly badge?: string;
}

interface NavSection {
  readonly title: string;
  readonly items: ReadonlyArray<NavItem>;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-sidebar" [ngClass]="{ 'sidebar-sm': collapsed() }">

      <!-- Header / Logo -->
      <div class="sidebar-header">
        <a class="logo-wrapper" routerLink="/dashboard">
          <div class="logo-icon">
            <i class="fas fa-cog"></i>
          </div>
          <span class="logo-text sidebar-label">MecaFlow</span>
        </a>
        <button class="sidebar-toggle" (click)="collapsed.set(!collapsed())" title="Recolher menu">
          <i class="fas" [ngClass]="collapsed() ? 'fa-bars' : 'fa-times'"></i>
        </button>
      </div>

      <!-- Navegação -->
      <nav class="sidebar-nav">
        @for (section of sections; track section.title) {
          <div class="navigation-header">{{ section.title }}</div>
          @for (item of section.items; track item.route) {
            <div class="menu-item">
              <a
                [routerLink]="item.route"
                routerLinkActive="active"
                [title]="collapsed() ? item.label : ''">
                <i class="{{ item.icon }}"></i>
                <span class="sidebar-label">{{ item.label }}</span>
                @if (item.badge) {
                  <span class="badge badge-pill badge-primary sidebar-label">{{ item.badge }}</span>
                }
              </a>
            </div>
          }
        }
      </nav>

      <!-- Rodapé do sidebar -->
      <div class="sidebar-footer">
        @if (user(); as u) {
          <div class="d-flex align-items-center gap-2 px-2 py-1">
            <div class="avatar" style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#4F6EF7,#7b5ea7);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:12px;flex-shrink:0;">
              {{ u.name.charAt(0).toUpperCase() }}
            </div>
            <div class="sidebar-label" style="overflow:hidden;">
              <div style="font-size:0.8rem;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ u.name }}</div>
              <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);">{{ u.role }}</div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class SidebarComponent {
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);

  readonly collapsed = signal(false);
  readonly user = this.authService.user;

  readonly sections: ReadonlyArray<NavSection> = [
    {
      title: 'CRM',
      items: [
        { label: 'Dashboard',   route: '/dashboard',     icon: 'fas fa-tachometer-alt' },
        { label: 'Conversas',   route: '/conversations', icon: 'fas fa-comments', badge: '3' },
        { label: 'Leads',       route: '/leads',         icon: 'fas fa-users' },
        { label: 'Kanban',      route: '/kanban',        icon: 'fas fa-columns' },
        { label: 'Agenda',      route: '/appointments',  icon: 'fas fa-calendar-alt' },
      ],
    },
    {
      title: 'Gestão',
      items: [
  { label: 'Base de Conhecimento', route: '/knowledge-base', icon: 'fas fa-book' },
  { label: 'Etiquetas', route: '/labels', icon: 'fas fa-tags' },
  { label: 'Automações', route: '/automations', icon: 'fas fa-bolt' },
  { label: 'Usuários', route: '/users', icon: 'fas fa-user-friends' },
  { label: 'Permissões', route: '/permissions', icon: 'fas fa-shield-alt' },
],
    },
    {
      title: 'Sistema',
      items: [
        { label: 'Configurações', route: '/settings', icon: 'fas fa-cog' },
      ],
    },
  ];
}
