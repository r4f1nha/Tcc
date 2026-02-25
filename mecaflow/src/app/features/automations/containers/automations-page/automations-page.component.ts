import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AutomationService } from '../../services/automation.service';
import { Automation, AutomationAction } from '../../models/automation.model';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-automations-page',
  standalone: true,
  imports: [DatePipe, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Automações</h1>
          <p class="text-sm text-slate-400 mt-1">Configure ações automáticas baseadas em etiquetas</p>
        </div>
        <button class="px-4 py-2 bg-[#4F6EF7] hover:bg-[#3d5ae0] text-white text-sm font-medium rounded-lg transition-colors">
          + Nova Automação
        </button>
      </div>

      @if (loading()) {
        @for (i of [1,2,3]; track i) { <app-skeleton variant="card" /> }
      } @else {
        <div class="space-y-3">
          @for (automation of automations(); track automation.id) {
            <div class="bg-[#22263a] rounded-xl border border-slate-700/50 p-5 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  [class]="automation.active ? 'bg-emerald-500/10' : 'bg-slate-500/10'">
                  {{ automation.active ? '⚡' : '⏸️' }}
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-white">{{ automation.name }}</h3>
                  <p class="text-xs text-slate-400">
                    Quando etiqueta
                    <span class="text-[#4F6EF7] font-medium">{{ automation.triggerLabelName }}</span>
                    → {{ getActionLabel(automation.action) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs text-slate-500 font-mono">{{ automation.updatedAt | date:'dd/MM/yyyy' }}</span>
                <!-- Toggle -->
                <button
                  (click)="onToggle(automation)"
                  class="relative w-10 h-5 rounded-full transition-colors"
                  [class]="automation.active ? 'bg-emerald-500' : 'bg-slate-600'">
                  <div
                    class="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform"
                    [class]="automation.active ? 'left-5' : 'left-0.5'">
                  </div>
                </button>
                <button class="text-xs text-slate-400 hover:text-white px-2 py-1">Ver logs</button>
              </div>
            </div>
          } @empty {
            <div class="text-center py-12 text-slate-500 text-sm">
              Nenhuma automação configurada
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AutomationsPageComponent implements OnInit {
  private readonly automationService = inject(AutomationService);

  readonly automations = signal<ReadonlyArray<Automation>>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.automationService.getAll().subscribe({
      next: (data) => {
        this.automations.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onToggle(automation: Automation): void {
    this.automationService
      .toggleActive(automation.id, !automation.active)
      .subscribe((updated) => {
        this.automations.update((list) =>
          list.map((a) => (a.id === updated.id ? updated : a)),
        );
      });
  }

  getActionLabel(action: AutomationAction): string {
    const map: Record<AutomationAction, string> = {
      [AutomationAction.SEND_MESSAGE]: 'Enviar mensagem',
      [AutomationAction.ASSIGN_AGENT]: 'Atribuir agente',
      [AutomationAction.CHANGE_STATUS]: 'Mudar status',
    };
    return map[action];
  }
}
