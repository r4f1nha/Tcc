import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LeadActions } from '../../store/actions/lead.actions';
import {
  selectAllLeads,
  selectLeadLoading,
  selectLeadPagination,
} from '../../store/selectors/lead.selectors';
import { LeadTableComponent } from '../../components/lead-table/lead-table.component';

@Component({
  selector: 'app-lead-list-page',
  standalone: true,
  imports: [LeadTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row mb-1">
      <div class="col-12">
        <div class="content-header d-flex align-items-center justify-content-between">
          <div>
            <i class="fas fa-users header-icon"></i>&nbsp;Leads
          </div>
          <button class="btn btn-primary btn-sm" (click)="onCreateLead()">
            <i class="fas fa-plus mr-1"></i>Novo Lead
          </button>
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-body py-2">
        <div class="row align-items-center">
          <div class="col-md-5 col-sm-8 col-12 mb-2 mb-md-0">
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-search"></i></span>
              </div>
              <input
                type="text"
                class="form-control"
                placeholder="Buscar leads por nome, telefone..."
              />
            </div>
          </div>

          <div class="col-md-3 col-sm-4 col-12 mb-2 mb-md-0">
            <select class="form-control form-control-sm">
              <option value="">Todos os status</option>
              <option value="NOVO_LEAD">Novo lead</option>
              <option value="QUALIFICACAO">Qualificação</option>
              <option value="PROPOSTA">Proposta</option>
              <option value="NEGOCIACAO">Negociação</option>
              <option value="GANHO">Ganho</option>
              <option value="PERDIDO">Perdido</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header d-flex align-items-center justify-content-between">
        <h6 class="card-title"><i class="fas fa-list"></i> Lista de Leads</h6>

        @if (pagination().totalItems > 0) {
          <small class="text-muted">{{ pagination().totalItems }} leads encontrados</small>
        }
      </div>

      <div class="card-body p-0">
        <app-lead-table
          [leads]="leads()"
          [loading]="loading()"
          (leadSelected)="onLeadSelected($event)"
          (editClicked)="onEditLead($event)"
          (deleteClicked)="onDeleteLead($event)"
        />
      </div>

      @if (pagination().totalPages > 1) {
        <div class="card-footer d-flex align-items-center justify-content-between">
          <small class="text-muted">
            Página {{ pagination().page + 1 }} de {{ pagination().totalPages }}
          </small>

          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" [class.disabled]="pagination().page === 0">
                <button class="page-link" type="button">Anterior</button>
              </li>
              <li class="page-item" [class.disabled]="pagination().page === pagination().totalPages - 1">
                <button class="page-link" type="button">Próxima</button>
              </li>
            </ul>
          </nav>
        </div>
      }
    </div>
  `,
})
export class LeadListPageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly leads = this.store.selectSignal(selectAllLeads);
  readonly loading = this.store.selectSignal(selectLeadLoading);
  readonly pagination = this.store.selectSignal(selectLeadPagination);

  ngOnInit(): void {
    this.store.dispatch(
      LeadActions.loadLeads({
        filters: {
          search: '',
          status: '',
          page: 0,
          pageSize: 10,
        },
      }),
    );
  }

  onLeadSelected(id: number): void {
    this.router.navigate(['/leads', id]);
  }

  onCreateLead(): void {
    this.router.navigate(['/leads', 'create']);
  }

  onEditLead(id: number): void {
    this.router.navigate(['/leads', 'edit', id]);
  }

  onDeleteLead(id: number): void {
  const confirmed = window.confirm('Tem certeza que deseja excluir este lead?');
  if (!confirmed) return;

  this.store.dispatch(LeadActions.deleteLead({ id }));

  setTimeout(() => {
    this.store.dispatch(
      LeadActions.loadLeads({
        filters: {
          search: '',
          status: '',
          page: 0,
          pageSize: 10,
        },
      }),
    );
  }, 300);
}
}