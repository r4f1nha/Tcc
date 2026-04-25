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
  styles: [`
    .lead-detail-wrapper {
      padding: 24px;
    }

    .lead-detail-value {
      color: #111827 !important;
      font-weight: 600;
      font-size: 1rem;
    }

    .lead-detail-muted {
      color: #6b7280 !important;
    }

    .lead-detail-title {
      color: #111827 !important;
      margin-bottom: 0;
    }

    .lead-detail-label {
      color: #6b7280 !important;
      text-transform: uppercase;
      font-weight: 700;
      font-size: 0.8rem;
      margin-bottom: 8px;
      display: block;
    }

    .lead-detail-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .lead-detail-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
    }

    .lead-detail-btn-edit {
      border: none;
      background: #4f46e5;
      color: #ffffff;
      border-radius: 8px;
      padding: 8px 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .lead-detail-btn-delete {
      border: none;
      background: #dc2626;
      color: #ffffff;
      border-radius: 8px;
      padding: 8px 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .lead-detail-btn-edit:hover {
      background: #4338ca;
    }

    .lead-detail-btn-delete:hover {
      background: #b91c1c;
    }
  `],
  template: `
    <div class="lead-detail-wrapper">
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
                  <h5 class="lead-detail-title">{{ lead.name }}</h5>
                  <small class="lead-detail-muted">
                    {{ lead.phone || 'Sem telefone' }} · {{ lead.email ?? 'Sem email' }}
                  </small>

                  <div class="lead-detail-actions">
                    <button type="button" class="lead-detail-btn-edit" (click)="editLead(lead.id)">
                      Editar
                    </button>

                    <button type="button" class="lead-detail-btn-delete" (click)="deleteLead(lead.id)">
                      Excluir
                    </button>
                  </div>
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
            <div class="card lead-detail-card">
              <div class="card-body py-3">
                <small class="lead-detail-label">Empresa</small>
                <span class="lead-detail-value">{{ lead.company ?? 'Não informada' }}</span>
              </div>
            </div>
          </div>

          <div class="col-md-4 mb-3">
            <div class="card lead-detail-card">
              <div class="card-body py-3">
                <small class="lead-detail-label">Origem</small>
                <span class="lead-detail-value">{{ lead.origin ?? 'Não informada' }}</span>
              </div>
            </div>
          </div>

          <div class="col-md-4 mb-3">
            <div class="card lead-detail-card">
              <div class="card-body py-3">
                <small class="lead-detail-label">Criado em</small>
                <span class="lead-detail-value">
                  {{ lead.createdAt ? (lead.createdAt | date:'dd/MM/yyyy HH:mm') : '—' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-4 mb-3">
            <div class="card lead-detail-card">
              <div class="card-body py-3">
                <small class="lead-detail-label">Etapa</small>
                <span class="lead-detail-value">{{ getStatusLabel(lead.stage) }}</span>
              </div>
            </div>
          </div>

          <div class="col-md-4 mb-3">
            <div class="card lead-detail-card">
              <div class="card-body py-3">
                <small class="lead-detail-label">Prioridade</small>
                <span class="lead-detail-value">{{ lead.priority }}</span>
              </div>
            </div>
          </div>

          <div class="col-md-4 mb-3">
            <div class="card lead-detail-card">
              <div class="card-body py-3">
                <small class="lead-detail-label">Valor</small>
                <span class="lead-detail-value">
                  {{ lead.value != null ? ('R$ ' + lead.value) : 'Não informado' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="card lead-detail-card mb-3">
          <div class="card-body">
            <small class="lead-detail-label">Próximo passo</small>
            <div class="lead-detail-value">{{ lead.nextStep || 'Nenhum próximo passo definido.' }}</div>
          </div>
        </div>

        <div class="card lead-detail-card">
          <div class="card-body">
            <small class="lead-detail-label">Observações</small>
            <div class="lead-detail-value">{{ lead.notes || 'Sem observações.' }}</div>
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
      this.store.dispatch(LeadActions.loadLeadDetail({ id: Number(id) }));
    }
  }

  goBack(): void {
    this.router.navigate(['/leads']);
  }

  editLead(id: number): void {
    this.router.navigate(['/leads', 'edit', id]);
  }

  deleteLead(id: number): void {
    const confirmed = window.confirm('Tem certeza que deseja excluir este lead?');
    if (!confirmed) return;

    this.store.dispatch(LeadActions.deleteLead({ id }));
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