import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LeadActions } from '../../store/actions/lead.actions';
import {
  selectAllLeads,
  selectLeadFilters,
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
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Leads</h1>
          <p class="text-sm text-slate-400 mt-1">Gerencie seus leads e contatos</p>
        </div>
        <button
          (click)="onCreateLead()"
          class="px-4 py-2 bg-[#4F6EF7] hover:bg-[#3d5ae0] text-white text-sm font-medium rounded-lg transition-colors">
          + Novo Lead
        </button>
      </div>

      <!-- Search -->
      <div class="flex items-center gap-3">
        <input
          type="text"
          placeholder="Buscar leads..."
          class="flex-1 max-w-md px-4 py-2 bg-[#1a1d27] border border-slate-600/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#4F6EF7]"
        />
      </div>

      <!-- Table -->
      <div class="bg-[#22263a] rounded-xl border border-slate-700/50">
        <app-lead-table
          [leads]="leads()"
          [loading]="loading()"
          (leadSelected)="onLeadSelected($event)"
        />
      </div>

      <!-- Pagination -->
      @if (pagination().totalPages > 1) {
        <div class="flex items-center justify-between text-sm text-slate-400">
          <span>{{ pagination().totalItems }} leads encontrados</span>
          <div class="flex items-center gap-2">
            <span>Página {{ pagination().page + 1 }} de {{ pagination().totalPages }}</span>
          </div>
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
  readonly filters = this.store.selectSignal(selectLeadFilters);
  readonly pagination = this.store.selectSignal(selectLeadPagination);

  ngOnInit(): void {
    this.store.dispatch(LeadActions.loadLeads({ filters: this.filters() }));
  }

  onLeadSelected(id: string): void {
    this.router.navigate(['/leads', id]);
  }

  onCreateLead(): void {
    this.router.navigate(['/leads', 'create']);
  }
}
