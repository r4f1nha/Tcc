import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LeadActions } from '../../store/actions/lead.actions';
import { selectLeadLoading, selectSelectedLead } from '../../store/selectors/lead.selectors';
import { LeadStatus } from '../../models/lead.model';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-lead-detail-page',
  standalone: true,
  imports: [SkeletonComponent, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 space-y-6">
      @if (loading()) {
        <app-skeleton variant="card" />
      } @else if (lead(); as lead) {
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button (click)="goBack()" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div class="w-14 h-14 rounded-full bg-[#4F6EF7]/20 flex items-center justify-center text-xl font-bold text-[#4F6EF7]">
              {{ lead.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h1 class="text-xl font-bold text-white">{{ lead.name }}</h1>
              <p class="text-sm text-slate-400">{{ lead.phone }} · {{ lead.email ?? 'Sem email' }}</p>
            </div>
          </div>
          <span class="text-xs px-3 py-1 rounded-full font-medium" [class]="getStatusClass(lead.status)">
            {{ getStatusLabel(lead.status) }}
          </span>
        </div>

        <!-- Info Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-[#22263a] rounded-xl border border-slate-700/50 p-5">
            <h3 class="text-xs text-slate-400 uppercase tracking-wider mb-2">Agente responsável</h3>
            <p class="text-white font-medium">{{ lead.assignedAgentName ?? 'Não atribuído' }}</p>
          </div>
          <div class="bg-[#22263a] rounded-xl border border-slate-700/50 p-5">
            <h3 class="text-xs text-slate-400 uppercase tracking-wider mb-2">Origem</h3>
            <p class="text-white font-medium">{{ lead.source }}</p>
          </div>
          <div class="bg-[#22263a] rounded-xl border border-slate-700/50 p-5">
            <h3 class="text-xs text-slate-400 uppercase tracking-wider mb-2">Criado em</h3>
            <p class="text-white font-medium font-mono text-sm">{{ lead.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
          </div>
        </div>

        <!-- Labels -->
        @if (lead.labels.length > 0) {
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400">Etiquetas:</span>
            @for (label of lead.labels; track label.id) {
              <span
                class="text-xs px-2 py-0.5 rounded-full"
                [style.background-color]="label.color + '20'"
                [style.color]="label.color">
                {{ label.name }}
              </span>
            }
          </div>
        }

        <!-- Tabs: Conversations, Appointments, Services -->
        <div class="bg-[#22263a] rounded-xl border border-slate-700/50">
          <div class="flex border-b border-slate-700/50">
            <button class="px-4 py-3 text-sm font-medium text-[#4F6EF7] border-b-2 border-[#4F6EF7]">Conversas</button>
            <button class="px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-300">Agendamentos</button>
            <button class="px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-300">Serviços</button>
          </div>
          <div class="p-6 text-center text-sm text-slate-500">
            Histórico será carregado conforme o backend estiver disponível
          </div>
        </div>
      }
    </div>
  `,
})
export class LeadDetailPageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly lead = this.store.selectSignal(selectSelectedLead);
  readonly loading = this.store.selectSignal(selectLeadLoading);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(LeadActions.loadLeadDetail({ id }));
    }
  }

  goBack(): void {
    this.router.navigate(['/leads']);
  }

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
