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
    <!-- Cabeçalho -->
    <div class="row mb-1">
      <div class="col-12">
        <div class="content-header d-flex align-items-center justify-content-between">
          <div>
            <i class="fas fa-clipboard-list header-icon"></i>&nbsp;Kanban
          </div>
          <div class="d-flex align-items-center">
            <div class="btn-group btn-group-sm mr-2">
              <button type="button" (click)="onToggleView()" class="btn"
                [class.btn-primary]="viewMode() === ViewMode.BOARD"
                [class.btn-outline-secondary]="viewMode() !== ViewMode.BOARD">
                <i class="fas fa-columns mr-1"></i>Board
              </button>
              <button type="button" (click)="onToggleView()" class="btn"
                [class.btn-primary]="viewMode() === ViewMode.LIST"
                [class.btn-outline-secondary]="viewMode() !== ViewMode.LIST">
                <i class="fas fa-list mr-1"></i>Lista
              </button>
            </div>
            <button class="btn btn-primary btn-sm">
              <i class="fas fa-plus mr-1"></i>Nova OS
            </button>
          </div>
        </div>
      </div>
    </div>

    @if (loading()) {
      <div class="row">
        @for (i of [1,2,3,4]; track i) {
          <div class="col-md-3 mb-3">
            <app-skeleton variant="card" />
          </div>
        }
      </div>
    } @else if (viewMode() === ViewMode.BOARD) {
      <!-- Board View -->
      <div class="row">
        @for (column of columns; track column.status) {
          <div class="col-lg-3 col-md-6 mb-3">
            <div class="card">
              <div class="card-header d-flex align-items-center justify-content-between py-2">
                <div class="d-flex align-items-center">
                  <span class="rounded-circle mr-2" style="width:10px;height:10px;display:inline-block;" [style.background-color]="column.color"></span>
                  <span class="font-weight-600 small">{{ column.label }}</span>
                </div>
                <span class="badge badge-secondary badge-pill">{{ getOrdersByStatus(column.status).length }}</span>
              </div>
              <div class="card-body p-2"
                cdkDropList
                [cdkDropListData]="column.status"
                (cdkDropListDropped)="onDrop($event)"
                style="min-height: 100px;">
                @for (order of getOrdersByStatus(column.status); track order.id) {
                  <div cdkDrag [cdkDragData]="order"
                    class="card mb-2"
                    style="cursor: grab;"
                    [class.border-danger]="isOverdue(order)">
                    <div class="card-body p-3">
                      <h6 class="card-title mb-1" style="font-size:0.85rem;">{{ order.title }}</h6>
                      <p class="text-muted mb-2" style="font-size:0.75rem;">{{ order.leadName }}</p>
                      <div class="d-flex align-items-center justify-content-between">
                        <span class="text-primary font-weight-600" style="font-size:0.75rem;">
                          {{ order.estimatedValue | currency:'BRL':'symbol':'1.0-0' }}
                        </span>
                        <span style="font-size:0.75rem;"
                          [class.text-danger]="isOverdue(order)"
                          [class.text-muted]="!isOverdue(order)">
                          {{ order.deadline | date:'dd/MM' }}
                        </span>
                      </div>
                      @if (order.assignedAgentName) {
                        <div class="mt-2 d-flex align-items-center">
                          <span class="badge badge-pill mr-1" style="background:rgba(79,110,247,0.15);color:#4F6EF7;font-size:10px;">
                            {{ order.assignedAgentName.charAt(0) }}
                          </span>
                          <small class="text-muted">{{ order.assignedAgentName }}</small>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
    } @else {
      <!-- List View -->
      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover table-sm mb-0">
              <thead class="thead-light">
                <tr>
                  <th>Título</th>
                  <th>Lead</th>
                  <th>Status</th>
                  <th>Responsável</th>
                  <th>Valor</th>
                  <th>Prazo</th>
                </tr>
              </thead>
              <tbody>
                @for (order of allOrders(); track order.id) {
                  <tr>
                    <td class="font-weight-600">{{ order.title }}</td>
                    <td class="text-muted">{{ order.leadName }}</td>
                    <td>
                      <span class="badge badge-pill"
                        [style.background-color]="getColumnColor(order.status) + '20'"
                        [style.color]="getColumnColor(order.status)">
                        {{ getColumnLabel(order.status) }}
                      </span>
                    </td>
                    <td class="text-muted">{{ order.assignedAgentName ?? '—' }}</td>
                    <td class="text-primary font-weight-600" style="font-size:0.8rem;">
                      {{ order.estimatedValue | currency:'BRL':'symbol':'1.0-0' }}
                    </td>
                    <td style="font-size:0.8rem;"
                      [class.text-danger]="isOverdue(order)"
                      [class.text-muted]="!isOverdue(order)">
                      {{ order.deadline | date:'dd/MM/yyyy' }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    }
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
