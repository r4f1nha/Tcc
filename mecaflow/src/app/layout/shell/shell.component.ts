import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastContainerComponent } from '../../shared/components/toast/toast-container.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ToastContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-screen bg-[#0f1117] text-white overflow-hidden">
      <app-sidebar />
      <main class="flex-1 overflow-y-auto">
        <router-outlet />
      </main>
      <app-toast-container />
    </div>
  `,
})
export class ShellComponent {}
