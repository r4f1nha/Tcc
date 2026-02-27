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
    @if (loading()) {
      <app-skeleton variant="card" />
    } @else if (lead(); as lead) {
      <!-- Cabeçalho -->
      <div class="row mb-1">
        <div class="col-12">
          <div class="content-header d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <button (click)="goBack()" class="btn btn-link btn-sm text-muted p-0 mr-3">
                <i class="fas fa-arrow-left"></i>
              </button>
              <div class="rounded-circle d-flex align-items-center justify-content-center mr-3 font-weight-700"
                style="width:48px;height:48px;background:rgba(79,110,247,0.15);color:#4F6EF7;font-size:1.2rem;flex-shrink:0;">
                {{ lead.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h5 class="mb-0">{{ lead.name }}</h5>
                <small class="text-muted">{{ lead.phone }} · {{ lead.email ?? 'Sem email' }}</small>
              </div>
            </div>
            <span class="badge badge-pill" [class]="getStatusClass(lead.status)">
              {{ getStatusLabel(lead.status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Info Cards -->
      <div class="row mb-3">
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body py-3">
              <small class="text-muted text-uppercase font-weight-600 d-block mb-1">Agente responsável</small>
              <span class="font-weight-600">{{ lead.assignedAgentName ?? 'Não atribuído' }}</span>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body py-3">
              <small class="text-muted text-uppercase font-weight-600 d-block mb-1">Origem</small>
              <span class="font-weight-600">{{ lead.source }}</span>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body py-3">
              <small class="text-muted text-uppercase font-weight-600 d-block mb-1">Criado em</small>
              <span class="font-weight-600" style="font-size:0.85rem;">{{ lead.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Labels -->
      @if (lead.labels.length > 0) {
        <div class="mb-3 d-flex align-items-center flex-wrap">
          <small class="text-muted mr-2">Etiquetas:</small>
          @for (label of lead.labels; track label.id) {
            <span class="badge badge-pill mr-1 mb-1"
              [style.background-color]="label.color + '20'"
              [style.color]="label.color">
              {{ label.name }}
            </span>
          }
        </div>
      }

      <!-- Tabs -->
      <div class="card">
        <div class="card-header p-0">
          <ul class="nav nav-tabs card-header-tabs ml-0">
            <li class="nav-item">
              <a class="nav-link active" href="javascript:void(0)">Conversas</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="javascript:void(0)">Agendamentos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="javascript:void(0)">Serviços</a>
            </li>
          </ul>
        </div>
        <div class="card-body text-center text-muted py-5">
          <small>Histórico será carregado conforme o backend estiver disponível</small>
        </div>
      </div>
    }
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
