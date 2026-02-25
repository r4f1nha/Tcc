import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { KanbanActions } from '../../store/actions/kanban.actions';
import {
  selectAllOrders,
  selectKanbanFilters,
  selectKanbanLoading,
  selectViewMode,
} from '../../store/selectors/kanban.selectors';
import {
  KANBAN_COLUMNS,
  ServiceOrder,
  ServiceOrderStatus,
  STATUS_ORDER,
  ViewMode,
} from '../../models/kanban.model';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-kanban-page',
  standalone: true,
  imports: [DragDropModule, DatePipe, CurrencyPipe, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Kanban</h1>
          <p class="text-sm text-slate-400 mt-1">Ordens de serviço</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex bg-[#1a1d27] rounded-lg p-1">
            <button
              (click)="onToggleView()"
              [class]="viewMode() === ViewMode.BOARD ? 'bg-[#4F6EF7] text-white' : 'text-slate-400'"
              class="px-3 py-1.5 rounded-md text-xs font-medium transition-all">
              Board
            </button>
            <button
              (click)="onToggleView()"
              [class]="viewMode() === ViewMode.LIST ? 'bg-[#4F6EF7] text-white' : 'text-slate-400'"
              class="px-3 py-1.5 rounded-md text-xs font-medium transition-all">
              Lista
            </button>
          </div>
          <button class="px-4 py-2 bg-[#4F6EF7] hover:bg-[#3d5ae0] text-white text-sm font-medium rounded-lg transition-colors">
            + Nova OS
          </button>
        </div>
      </div>

      @if (loading()) {
        <div class="grid grid-cols-4 gap-4">
          @for (i of [1,2,3,4]; track i) {
            <app-skeleton variant="card" />
          }
        </div>
      } @else if (viewMode() === ViewMode.BOARD) {
        <!-- Board View -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          @for (column of columns; track column.status) {
            <div class="bg-[#1a1d27] rounded-xl p-3 min-h-[200px]">
              <div class="flex items-center justify-between mb-3 px-1">
                <div class="flex items-center gap-2">
                  <div class="w-2.5 h-2.5 rounded-full" [style.background-color]="column.color"></div>
                  <span class="text-sm font-semibold text-white">{{ column.label }}</span>
                </div>
                <span class="text-xs text-slate-500 bg-[#22263a] px-2 py-0.5 rounded-full">
                  {{ getOrdersByStatus(column.status).length }}
                </span>
              </div>

              <div
                cdkDropList
                [cdkDropListData]="column.status"
                (cdkDropListDropped)="onDrop($event)"
                class="space-y-2 min-h-[100px]">
                @for (order of getOrdersByStatus(column.status); track order.id) {
                  <div
                    cdkDrag
                    [cdkDragData]="order"
                    class="bg-[#22263a] rounded-lg p-3 border cursor-grab active:cursor-grabbing transition-all hover:border-[#4F6EF7]/30"
                    [class]="isOverdue(order) ? 'border-red-500' : 'border-slate-700/50'">
                    <h4 class="text-sm font-medium text-white mb-1">{{ order.title }}</h4>
                    <p class="text-xs text-slate-400 mb-2">{{ order.leadName }}</p>
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-[#4F6EF7] font-mono">
                        {{ order.estimatedValue | currency:'BRL':'symbol':'1.0-0' }}
                      </span>
                      <span [class]="isOverdue(order) ? 'text-red-400' : 'text-slate-500'" class="font-mono">
                        {{ order.deadline | date:'dd/MM' }}
                      </span>
                    </div>
                    @if (order.assignedAgentName) {
                      <div class="mt-2 flex items-center gap-1.5">
                        <div class="w-5 h-5 rounded-full bg-[#4F6EF7]/20 flex items-center justify-center text-[10px] text-[#4F6EF7] font-bold">
                          {{ order.assignedAgentName.charAt(0) }}
                        </div>
                        <span class="text-xs text-slate-500">{{ order.assignedAgentName }}</span>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- List View -->
        <div class="bg-[#22263a] rounded-xl border border-slate-700/50 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-700/50 text-xs text-slate-400 uppercase tracking-wider">
                <th class="px-4 py-3 text-left font-medium">Título</th>
                <th class="px-4 py-3 text-left font-medium">Lead</th>
                <th class="px-4 py-3 text-left font-medium">Status</th>
                <th class="px-4 py-3 text-left font-medium">Responsável</th>
                <th class="px-4 py-3 text-left font-medium">Valor</th>
                <th class="px-4 py-3 text-left font-medium">Prazo</th>
              </tr>
            </thead>
            <tbody>
              @for (order of allOrders(); track order.id) {
                <tr class="border-b border-slate-700/30 hover:bg-[#1a1d27] transition-colors">
                  <td class="px-4 py-3 text-white font-medium">{{ order.title }}</td>
                  <td class="px-4 py-3 text-slate-400">{{ order.leadName }}</td>
                  <td class="px-4 py-3">
                    <span class="text-xs px-2 py-0.5 rounded-full"
                      [style.background-color]="getColumnColor(order.status) + '15'"
                      [style.color]="getColumnColor(order.status)">
                      {{ getColumnLabel(order.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-slate-400">{{ order.assignedAgentName ?? '—' }}</td>
                  <td class="px-4 py-3 text-[#4F6EF7] font-mono text-xs">
                    {{ order.estimatedValue | currency:'BRL':'symbol':'1.0-0' }}
                  </td>
                  <td class="px-4 py-3 font-mono text-xs" [class]="isOverdue(order) ? 'text-red-400' : 'text-slate-500'">
                    {{ order.deadline | date:'dd/MM/yyyy' }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class KanbanPageComponent implements OnInit {
  private readonly store = inject(Store);

  readonly allOrders = this.store.selectSignal(selectAllOrders);
  readonly viewMode = this.store.selectSignal(selectViewMode);
  readonly loading = this.store.selectSignal(selectKanbanLoading);
  readonly filters = this.store.selectSignal(selectKanbanFilters);

  protected readonly ViewMode = ViewMode;
  readonly columns = KANBAN_COLUMNS;

  ngOnInit(): void {
    this.store.dispatch(KanbanActions.loadServiceOrders({ filters: this.filters() }));
  }

  getOrdersByStatus(status: ServiceOrderStatus): ReadonlyArray<ServiceOrder> {
    return this.allOrders().filter((o) => o.status === status);
  }

  isOverdue(order: ServiceOrder): boolean {
    return (
      new Date(order.deadline) < new Date() &&
      order.status !== ServiceOrderStatus.COMPLETED
    );
  }

  getColumnColor(status: ServiceOrderStatus): string {
    return this.columns.find((c) => c.status === status)?.color ?? '#6b7280';
  }

  getColumnLabel(status: ServiceOrderStatus): string {
    return this.columns.find((c) => c.status === status)?.label ?? status;
  }

  onToggleView(): void {
    this.store.dispatch(KanbanActions.toggleViewMode());
  }

  onDrop(event: CdkDragDrop<ServiceOrderStatus>): void {
    const order = event.item.data as ServiceOrder;
    const newStatus = event.container.data;
    const oldIndex = STATUS_ORDER.indexOf(order.status);
    const newIndex = STATUS_ORDER.indexOf(newStatus);

    if (newIndex <= oldIndex && newStatus !== order.status) {
      return; // Forward-only: cannot go back
    }

    if (newStatus !== order.status) {
      this.store.dispatch(
        KanbanActions.moveCard({ orderId: order.id, newStatus }),
      );
    }
  }
}
