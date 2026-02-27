import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastContainerComponent } from '../../shared/components/toast/toast-container.component';
import { AuthService } from '../../core/auth/services/auth.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ToastContainerComponent, NgxSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrapper">
      <!-- Sidebar -->
      <app-sidebar />

      <!-- Main Panel -->
      <div class="main-panel" style="margin-left: 260px;">
        <!-- Top Bar -->
        <div class="top-bar">
          <!-- Busca global -->
          <div class="search-input-wrapper d-none d-md-block">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Buscar cliente, telefone ou OS..." />
          </div>

          <!-- Ações do topbar -->
          <div class="topbar-actions">
            <!-- Notificações -->
            <button class="btn-topbar">
              <i class="fas fa-bell"></i>
              <span class="badge-dot"></span>
            </button>

            <!-- Ajuda -->
            <button class="btn-topbar d-none d-sm-flex">
              <i class="fas fa-question-circle"></i>
            </button>

            <!-- Usuário -->
            @if (user(); as u) {
              <div class="user-info">
                <div class="avatar">{{ u.name.charAt(0).toUpperCase() }}</div>
                <div class="d-none d-sm-block">
                  <div class="user-name">{{ u.name }}</div>
                  <div class="user-role">{{ u.role }}</div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Conteúdo principal -->
        <div class="main-content">
          <div class="content-overlay"></div>
          <div class="content-wrapper">
            <router-outlet />
          </div>
        </div>
      </div>

      <!-- Spinner global -->
      <ngx-spinner bdColor="rgba(0,0,0,0.4)" size="medium" color="#4F6EF7" type="ball-scale-multiple">
        <p style="color:#fff; font-size:13px; margin-top:10px;">Carregando...</p>
      </ngx-spinner>

      <!-- Toasts -->
      <app-toast-container />
    </div>
  `,
})
export class ShellComponent {
  private readonly authService = inject(AuthService);
  readonly user = this.authService.user;
}
