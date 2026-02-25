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
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead>
          <tr class="border-b border-slate-700/50 text-slate-400 text-xs uppercase tracking-wider">
            <th class="px-4 py-3 font-medium">Nome</th>
            <th class="px-4 py-3 font-medium">Telefone</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 font-medium">Agente</th>
            <th class="px-4 py-3 font-medium">Etiquetas</th>
            <th class="px-4 py-3 font-medium">Criado em</th>
          </tr>
        </thead>
        <tbody>
          @if (loading()) {
            @for (i of [1,2,3,4,5]; track i) {
              <tr class="border-b border-slate-700/30">
                <td class="px-4 py-3" colspan="6">
                  <app-skeleton variant="text" />
                </td>
              </tr>
            }
          } @else {
            @for (lead of leads(); track lead.id) {
              <tr
                (click)="leadSelected.emit(lead.id)"
                class="border-b border-slate-700/30 hover:bg-[#1a1d27] cursor-pointer transition-colors">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-[#4F6EF7]/20 flex items-center justify-center text-xs font-semibold text-[#4F6EF7]">
                      {{ lead.name.charAt(0).toUpperCase() }}
                    </div>
                    <span class="text-white font-medium">{{ lead.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-slate-300 font-mono text-xs">{{ lead.phone }}</td>
                <td class="px-4 py-3">
                  <span class="text-xs px-2 py-1 rounded-full font-medium" [class]="getStatusClass(lead.status)">
                    {{ getStatusLabel(lead.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-400">{{ lead.assignedAgentName ?? '—' }}</td>
                <td class="px-4 py-3">
                  <div class="flex gap-1">
                    @for (label of lead.labels; track label.id) {
                      <span
                        class="text-xs px-2 py-0.5 rounded-full text-white"
                        [style.background-color]="label.color + '30'"
                        [style.color]="label.color">
                        {{ label.name }}
                      </span>
                    }
                  </div>
                </td>
                <td class="px-4 py-3 text-slate-500 text-xs font-mono">
                  {{ lead.createdAt | date:'dd/MM/yyyy' }}
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="px-4 py-12 text-center text-slate-500">
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
      [LeadStatus.NEW]: 'bg-blue-500/10 text-blue-400',
      [LeadStatus.CONTACTED]: 'bg-amber-500/10 text-amber-400',
      [LeadStatus.QUALIFIED]: 'bg-emerald-500/10 text-emerald-400',
      [LeadStatus.CONVERTED]: 'bg-green-500/10 text-green-400',
      [LeadStatus.LOST]: 'bg-red-500/10 text-red-400',
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
