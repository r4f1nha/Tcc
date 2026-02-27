import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { KnowledgeBaseActions } from '../../store/actions/knowledge-base.actions';
import { selectAllEntries, selectKBFilters, selectKBLoading } from '../../store/selectors/knowledge-base.selectors';
import { KnowledgeCategory } from '../../models/knowledge-base.model';
import { DatePipe } from '@angular/common';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-knowledge-base-page',
  standalone: true,
  imports: [DatePipe, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Cabeçalho -->
    <div class="row mb-1">
      <div class="col-12">
        <div class="content-header d-flex align-items-center justify-content-between">
          <div>
            <i class="fas fa-book header-icon"></i>&nbsp;Base de Conhecimento
          </div>
          <button class="btn btn-primary btn-sm">
            <i class="fas fa-plus mr-1"></i>Nova Entrada
          </button>
        </div>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="mb-3">
      <div class="btn-group btn-group-sm">
        <button type="button" class="btn"
          [class.btn-primary]="!filters().category"
          [class.btn-outline-secondary]="!!filters().category"
          (click)="onFilterCategory(null)">
          Todas
        </button>
        @for (cat of categories; track cat.value) {
          <button type="button" class="btn"
            [class.btn-primary]="filters().category === cat.value"
            [class.btn-outline-secondary]="filters().category !== cat.value"
            (click)="onFilterCategory(cat.value)">
            {{ cat.label }}
          </button>
        }
      </div>
    </div>

    <!-- Entries -->
    @if (loading()) {
      <div class="row">
        @for (i of [1,2,3,4]; track i) {
          <div class="col-md-6 mb-3"><app-skeleton variant="card" /></div>
        }
      </div>
    } @else {
      <div class="row">
        @for (entry of entries(); track entry.id) {
          <div class="col-md-6 mb-3">
            <div class="card h-100">
              <div class="card-body">
                <div class="d-flex align-items-start justify-content-between mb-2">
                  <h6 class="card-title mb-0">{{ entry.title }}</h6>
                  <span class="badge badge-pill badge-primary ml-2" style="flex-shrink:0;">
                    {{ getCategoryLabel(entry.category) }}
                  </span>
                </div>
                <p class="card-text text-muted" style="font-size:0.8rem;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;">{{ entry.content }}</p>
              </div>
              <div class="card-footer d-flex align-items-center justify-content-between py-2">
                <small class="text-muted">{{ entry.updatedAt | date:'dd/MM/yyyy HH:mm' }}</small>
                <div>
                  <button class="btn btn-link btn-sm text-primary p-0 mr-2">Editar</button>
                  <button class="btn btn-link btn-sm text-danger p-0">Excluir</button>
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-12">
            <div class="card">
              <div class="card-body text-center text-muted py-5">
                Nenhuma entrada na base de conhecimento
              </div>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class KnowledgeBasePageComponent implements OnInit {
  private readonly store = inject(Store);

  readonly entries = this.store.selectSignal(selectAllEntries);
  readonly loading = this.store.selectSignal(selectKBLoading);
  readonly filters = this.store.selectSignal(selectKBFilters);

  readonly categories: ReadonlyArray<{ label: string; value: KnowledgeCategory }> = [
    { label: 'Horários', value: KnowledgeCategory.HORARIOS },
    { label: 'Serviços', value: KnowledgeCategory.SERVICOS },
    { label: 'Preços', value: KnowledgeCategory.PRECOS },
    { label: 'Políticas', value: KnowledgeCategory.POLITICAS },
  ];

  ngOnInit(): void {
    this.store.dispatch(KnowledgeBaseActions.loadEntries({ filters: this.filters() }));
  }

  onFilterCategory(category: KnowledgeCategory | null): void {
    this.store.dispatch(KnowledgeBaseActions.setCategoryFilter({ category }));
    this.store.dispatch(KnowledgeBaseActions.loadEntries({
      filters: { ...this.filters(), category },
    }));
  }

  getCategoryLabel(category: KnowledgeCategory): string {
    const map: Record<KnowledgeCategory, string> = {
      [KnowledgeCategory.HORARIOS]: 'Horários',
      [KnowledgeCategory.SERVICOS]: 'Serviços',
      [KnowledgeCategory.PRECOS]: 'Preços',
      [KnowledgeCategory.POLITICAS]: 'Políticas',
    };
    return map[category];
  }
}
