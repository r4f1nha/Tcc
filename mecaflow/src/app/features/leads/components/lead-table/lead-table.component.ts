import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Lead, LeadStatus } from '../../models/lead.model';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-lead-table',
  standalone: true,
  imports: [DatePipe, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-responsive">
      <table class="table table-hover table-sm mb-0">
        <thead class="thead-light">
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Status</th>
            <th>Agente</th>
            <th>Etiquetas</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          @if (loading()) {
            @for (i of [1,2,3,4,5]; track i) {
              <tr>
                <td colspan="6">
                  <app-skeleton variant="text" />
                </td>
              </tr>
            }
          } @else {
            @for (lead of leads(); track lead.id) {
              <tr (click)="leadSelected.emit(lead.id)" style="cursor:pointer;">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="rounded-circle d-flex align-items-center justify-content-center mr-2 font-weight-600"
                      style="width:32px;height:32px;background:rgba(79,110,247,0.15);color:#4F6EF7;font-size:0.75rem;flex-shrink:0;">
                      {{ lead.name.charAt(0).toUpperCase() }}
                    </div>
                    <span class="font-weight-600">{{ lead.name }}</span>
                  </div>
                </td>
                <td class="text-muted" style="font-size:0.8rem;">{{ lead.phone }}</td>
                <td>
                  <span class="badge badge-pill" [class]="getStatusClass(lead.status)">
                    {{ getStatusLabel(lead.status) }}
                  </span>
                </td>
                <td class="text-muted">{{ lead.assignedAgentName ?? '—' }}</td>
                <td>
                  @for (label of lead.labels; track label.id) {
                    <span class="badge badge-pill mr-1"
                      [style.background-color]="label.color + '30'"
                      [style.color]="label.color">
                      {{ label.name }}
                    </span>
                  }
                </td>
                <td class="text-muted" style="font-size:0.8rem;">
                  {{ lead.createdAt | date:'dd/MM/yyyy' }}
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="text-center text-muted py-4">
                  Nenhum lead encontrado
                </td>
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
})
export class LeadTableComponent {
  readonly leads = input.required<ReadonlyArray<Lead>>();
  readonly loading = input(false);
  readonly leadSelected = output<string>();

  getStatusClass(status: LeadStatus): string {
    const classes: Record<LeadStatus, string> = {
      [LeadStatus.NEW]: 'badge-info',
      [LeadStatus.CONTACTED]: 'badge-warning',
      [LeadStatus.QUALIFIED]: 'badge-primary',
      [LeadStatus.CONVERTED]: 'badge-success',
      [LeadStatus.LOST]: 'badge-danger',
    };
    return classes[status];
  }

  getStatusLabel(status: LeadStatus): string {
    const labels: Record<LeadStatus, string> = {
      [LeadStatus.NEW]: 'Novo',
      [LeadStatus.CONTACTED]: 'Contatado',
      [LeadStatus.QUALIFIED]: 'Qualificado',
      [LeadStatus.CONVERTED]: 'Convertido',
      [LeadStatus.LOST]: 'Perdido',
    };
    return labels[status];
  }
}
