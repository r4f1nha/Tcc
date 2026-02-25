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
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Base de Conhecimento</h1>
          <p class="text-sm text-slate-400 mt-1">Informações usadas pelo agente de IA</p>
        </div>
        <button class="px-4 py-2 bg-[#4F6EF7] hover:bg-[#3d5ae0] text-white text-sm font-medium rounded-lg transition-colors">
          + Nova Entrada
        </button>
      </div>

      <!-- Category Tabs -->
      <div class="flex gap-2">
        <button (click)="onFilterCategory(null)"
          [class]="!filters().category ? 'bg-[#4F6EF7] text-white' : 'bg-[#1a1d27] text-slate-400 hover:text-white'"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
          Todas
        </button>
        @for (cat of categories; track cat.value) {
          <button (click)="onFilterCategory(cat.value)"
            [class]="filters().category === cat.value ? 'bg-[#4F6EF7] text-white' : 'bg-[#1a1d27] text-slate-400 hover:text-white'"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
            {{ cat.label }}
          </button>
        }
      </div>

      <!-- Entries Grid -->
      @if (loading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (i of [1,2,3,4]; track i) { <app-skeleton variant="card" /> }
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (entry of entries(); track entry.id) {
            <div class="bg-[#22263a] rounded-xl border border-slate-700/50 p-5 hover:border-[#4F6EF7]/30 transition-all">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-sm font-semibold text-white">{{ entry.title }}</h3>
                <span class="text-xs px-2 py-0.5 rounded-full bg-[#4F6EF7]/10 text-[#4F6EF7]">
                  {{ getCategoryLabel(entry.category) }}
                </span>
              </div>
              <p class="text-xs text-slate-400 line-clamp-3 mb-3">{{ entry.content }}</p>
              <div class="flex items-center justify-between text-xs text-slate-500">
                <span class="font-mono">{{ entry.updatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                <div class="flex gap-2">
                  <button class="text-[#4F6EF7] hover:text-[#3d5ae0]">Editar</button>
                  <button class="text-red-400 hover:text-red-300">Excluir</button>
                </div>
              </div>
            </div>
          } @empty {
            <div class="col-span-2 text-center py-12 text-slate-500 text-sm">
              Nenhuma entrada na base de conhecimento
            </div>
          }
        </div>
      }
    </div>
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
