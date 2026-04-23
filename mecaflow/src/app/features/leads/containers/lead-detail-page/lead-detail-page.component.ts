import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
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
      <div class="row mb-1">
        <div class="col-12">
          <div class="content-header d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <button (click)="goBack()" class="btn btn-link btn-sm text-muted p-0 mr-3" type="button">
                <i class="fas fa-arrow-left"></i>
              </button>

              <div
                class="rounded-circle d-flex align-items-center justify-content-center mr-3 font-weight-700"
                style="width:48px;height:48px;background:rgba(79,110,247,0.15);color:#4F6EF7;font-size:1.2rem;flex-shrink:0;"
              >
                {{ lead.name.charAt(0).toUpperCase() }}
              </div>

              <div>
                <h5 class="mb-0">{{ lead.name }}</h5>
                <small class="text-muted">
                  {{ lead.phone || 'Sem telefone' }} · {{ lead.email ?? 'Sem email' }}
                </small>
              </div>
            </div>

            <span class="badge badge-pill" [class]="getStatusClass(lead.status)">
              {{ getStatusLabel(lead.status) }}
            </span>
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body py-3">
              <small class="text-muted text-uppercase font-weight-600 d-block mb-1">Empresa</small>
              <span class="font-weight-600">{{ lead.company ?? 'Não informada' }}</span>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body py-3">
              <small class="text-muted text-uppercase font-weight-600 d-block mb-1">Origem</small>
              <span class="font-weight-600">{{ lead.origin ?? 'Não informada' }}</span>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body py-3">
              <small class="text-muted text-uppercase font-weight-600 d-block mb-1">Criado em</small>
              <span class="font-weight-600" style="font-size:0.85rem;">
                {{ lead.createdAt ? (lead.createdAt | date:'dd/MM/yyyy HH:mm') : '—' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body py-3">
              <small class="text-muted text-uppercase font-weight-600 d-block mb-1">Etapa</small>
              <span class="font-weight-600">{{ getStatusLabel(lead.stage) }}</span>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body py-3">
              <small class="text-muted text-uppercase font-weight-600 d-block mb-1">Prioridade</small>
              <span class="font-weight-600">{{ lead.priority }}</span>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body py-3">
              <small class="text-muted text-uppercase font-weight-600 d-block mb-1">Valor</small>
              <span class="font-weight-600">
                {{ lead.value != null ? ('R$ ' + lead.value) : 'Não informado' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-body">
          <small class="text-muted text-uppercase font-weight-600 d-block mb-2">Próximo passo</small>
          <div>{{ lead.nextStep || 'Nenhum próximo passo definido.' }}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <small class="text-muted text-uppercase font-weight-600 d-block mb-2">Observações</small>
          <div>{{ lead.notes || 'Sem observações.' }}</div>
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
      NOVO_LEAD: 'badge-info',
      QUALIFICACAO: 'badge-primary',
      PROPOSTA: 'badge-warning',
      NEGOCIACAO: 'badge-secondary',
      GANHO: 'badge-success',
      PERDIDO: 'badge-danger',
    };
    return classes[status];
  }

  getStatusLabel(status: LeadStatus): string {
    const labels: Record<LeadStatus, string> = {
      NOVO_LEAD: 'Novo lead',
      QUALIFICACAO: 'Qualificação',
      PROPOSTA: 'Proposta',
      NEGOCIACAO: 'Negociação',
      GANHO: 'Ganho',
      PERDIDO: 'Perdido',
    };
    return labels[status];
  }
}