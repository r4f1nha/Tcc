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
    <!-- Cabeçalho -->
    <div class="row mb-1">
      <div class="col-12">
        <div class="content-header d-flex align-items-center justify-content-between">
          <div>
            <i class="fas fa-bolt header-icon"></i>&nbsp;Automações
          </div>
          <button class="btn btn-primary btn-sm">
            <i class="fas fa-plus mr-1"></i>Nova Automação
          </button>
        </div>
      </div>
    </div>

    @if (loading()) {
      @for (i of [1,2,3]; track i) {
        <div class="mb-3"><app-skeleton variant="card" /></div>
      }
    } @else {
      @for (automation of automations(); track automation.id) {
        <div class="card mb-3">
          <div class="card-body d-flex align-items-center justify-content-between py-3">
            <div class="d-flex align-items-center">
              <div class="rounded d-flex align-items-center justify-content-center mr-3"
                style="width:40px;height:40px;font-size:1.1rem;flex-shrink:0;"
                [style.background]="automation.active ? 'rgba(40,199,111,0.1)' : 'rgba(108,117,125,0.1)'">
                <i class="fas"
                  [class.fa-bolt]="automation.active"
                  [class.fa-pause]="!automation.active"
                  [class.text-success]="automation.active"
                  [class.text-muted]="!automation.active"></i>
              </div>
              <div>
                <h6 class="mb-0 font-weight-600">{{ automation.name }}</h6>
                <small class="text-muted">
                  Quando etiqueta
                  <span class="text-primary font-weight-600">{{ automation.triggerLabelName }}</span>
                  → {{ getActionLabel(automation.action) }}
                </small>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <small class="text-muted mr-3">{{ automation.updatedAt | date:'dd/MM/yyyy' }}</small>
              <div class="custom-control custom-switch mr-2">
                <input type="checkbox" class="custom-control-input"
                  [id]="'toggle-' + automation.id"
                  [checked]="automation.active"
                  (change)="onToggle(automation)">
                <label class="custom-control-label" [for]="'toggle-' + automation.id"></label>
              </div>
              <button class="btn btn-link btn-sm text-muted p-0">Ver logs</button>
            </div>
          </div>
        </div>
      } @empty {
        <div class="card">
          <div class="card-body text-center text-muted py-5">
            Nenhuma automação configurada
          </div>
        </div>
      }
    }
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
