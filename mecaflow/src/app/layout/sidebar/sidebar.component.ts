import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { Theme } from '../../core/services/theme.service';

interface NavItem {
  readonly label: string;
  readonly route: string;
  readonly icon: string;
  readonly roles?: ReadonlyArray<string>;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      class="h-screen flex flex-col bg-[#1a1d27] border-r border-slate-700/50 transition-all duration-300"
      [class]="collapsed() ? 'w-16' : 'w-64'">

      <!-- Logo -->
      <div class="flex items-center justify-between px-4 h-16 border-b border-slate-700/50">
        @if (!collapsed()) {
          <h1 class="text-lg font-bold text-white">
            <span class="text-[#4F6EF7]">Meca</span>Flow
          </h1>
        }
        <button
          (click)="collapsed.set(!collapsed())"
          class="p-1.5 text-slate-400 hover:text-white hover:bg-[#22263a] rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            @if (collapsed()) {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
            } @else {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
            }
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-[#4F6EF7]/10 text-[#4F6EF7]"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-[#22263a] transition-all">
            <span class="text-lg shrink-0 w-6 text-center">{{ item.icon }}</span>
            @if (!collapsed()) {
              <span>{{ item.label }}</span>
            }
          </a>
        }
      </nav>

      <!-- Footer -->
      <div class="p-3 border-t border-slate-700/50">
        <button
          (click)="toggleTheme()"
          class="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-[#22263a] transition-all">
          <span class="text-lg shrink-0 w-6 text-center">{{ isDark() ? '☀️' : '🌙' }}</span>
          @if (!collapsed()) {
            <span>{{ isDark() ? 'Tema claro' : 'Tema escuro' }}</span>
          }
        </button>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  private readonly themeService = inject(ThemeService);

  readonly collapsed = signal(false);

  readonly navItems: ReadonlyArray<NavItem> = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Conversas', route: '/conversations', icon: '💬' },
    { label: 'Leads', route: '/leads', icon: '👥' },
    { label: 'Agenda', route: '/appointments', icon: '📅' },
    { label: 'Kanban', route: '/kanban', icon: '📋' },
    { label: 'Base de Conhecimento', route: '/knowledge-base', icon: '📚' },
    { label: 'Automações', route: '/automations', icon: '⚡' },
    { label: 'Times', route: '/teams', icon: '🏢' },
    { label: 'Configurações', route: '/settings', icon: '⚙️' },
  ];

  isDark(): boolean {
    return this.themeService.currentTheme() === Theme.DARK;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
