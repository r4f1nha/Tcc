import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CdkDragDrop,
  DragDropModule,
} from '@angular/cdk/drag-drop';

import {
  ServiceOrder,
  ServiceOrderKanbanResponse,
  ServiceOrderStatus,
} from '../../models/service-order';
import { ServiceOrderService } from '../../services/service-order.service';

@Component({
  selector: 'app-kanban-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kanban-page">
      <div class="kanban-header">
        <div class="kanban-title">
          <i class="fas fa-clipboard-list"></i>
          <span>Kanban</span>
        </div>

        <button class="btn btn-primary new-order-button" (click)="goToCreate()">
          <i class="fas fa-plus"></i>
          Nova OS
        </button>
      </div>

      <div class="kanban-filters">
        <div class="filter-field">
          <label>Buscar cliente</label>
          <input
            class="form-control"
            type="text"
            [(ngModel)]="customerFilter"
            (ngModelChange)="applyFilters()"
            placeholder="Digite o nome do cliente"
          />
        </div>

        <div class="filter-field">
          <label>Status</label>
          <select
            class="form-control"
            [(ngModel)]="statusFilter"
            (ngModelChange)="applyFilters()"
          >
            <option value="">Todos</option>
            <option value="ABERTA">Aberta</option>
            <option value="EM_ANALISE">Em análise</option>
            <option value="AGUARDANDO_CLIENTE">Aguardando cliente</option>
            <option value="FINALIZADA">Finalizada</option>
          </select>
        </div>

        <button class="btn btn-outline-secondary clear-button" type="button" (click)="clearFilters()">
          Limpar filtros
        </button>
      </div>

      <div class="kanban-board">
        <div class="kanban-column" *ngFor="let column of columns">
          <div class="kanban-column-header">
            <span class="column-title">{{ column.label }}</span>
            <span class="column-count">{{ getOrders(column.status).length }}</span>
          </div>

          <div
            class="kanban-column-body"
            cdkDropList
            [id]="column.status"
            [cdkDropListData]="getOrders(column.status)"
            [cdkDropListConnectedTo]="dropListIds"
            (cdkDropListDropped)="drop($event, column.status)"
          >
            <div
              *ngFor="let order of getOrders(column.status)"
              class="order-card"
              cdkDrag
              [cdkDragData]="order"
              (click)="goToDetail(order.id)"
            >
              <div class="order-customer">
                {{ order.customerName || 'Cliente não informado' }}
              </div>

              <div class="order-vehicle">
                {{ order.vehicle || 'Sem veículo' }}
              </div>

              <div class="order-description">
                {{ order.problemDescription || 'Sem descrição' }}
              </div>

              <div class="order-footer">
                <span class="priority-badge">
                  {{ order.priority || 'Sem prioridade' }}
                </span>

                <div class="order-actions">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    [disabled]="!getPreviousStatus(order.status)"
                    (click)="movePrevious(order, $event)"
                  >
                    Voltar
                  </button>

                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    [disabled]="!getNextStatus(order.status)"
                    (click)="moveNext(order, $event)"
                  >
                    Avançar
                  </button>
                </div>
              </div>
            </div>

            <div *ngIf="getOrders(column.status).length === 0" class="empty-column">
              Nenhuma OS
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .kanban-page {
        width: 100%;
        min-height: calc(100vh - 80px);
        background: #f3f4f6;
        padding: 28px;
      }

      .kanban-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .kanban-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 28px;
        font-weight: 700;
        color: #1f2937;
      }

      .new-order-button {
        display: flex;
        align-items: center;
        gap: 8px;
        border-radius: 10px;
        padding: 10px 18px;
        font-weight: 600;
      }

      .kanban-filters {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 18px;
        margin-bottom: 24px;
        display: grid;
        grid-template-columns: 1fr 260px auto;
        gap: 16px;
        align-items: end;
      }

      .filter-field label {
        display: block;
        font-weight: 700;
        color: #111827;
        margin-bottom: 8px;
      }

      .form-control {
        background: #ffffff;
        color: #111827;
        border: 1px solid #dbe1ea;
        border-radius: 8px;
        min-height: 44px;
      }

      .clear-button {
        min-height: 44px;
        border-radius: 8px;
        font-weight: 600;
      }

      .kanban-board {
        display: grid;
        grid-template-columns: repeat(4, minmax(240px, 1fr));
        gap: 24px;
      }

      .kanban-column {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
        overflow: hidden;
        min-height: 220px;
      }

      .kanban-column-header {
        min-height: 72px;
        padding: 18px 20px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #ffffff;
      }

      .column-title {
        font-size: 18px;
        font-weight: 700;
        color: #1f2937;
      }

      .column-count {
        min-width: 28px;
        height: 28px;
        padding: 0 8px;
        border-radius: 8px;
        background: #6b7280;
        color: #ffffff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
      }

      .kanban-column-body {
        padding: 16px;
        background: #ffffff;
        min-height: 180px;
      }

      .order-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 14px;
        margin-bottom: 12px;
        box-shadow: 0 6px 14px rgba(15, 23, 42, 0.06);
        cursor: grab;
      }

      .order-card:active {
        cursor: grabbing;
      }

      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 12px;
        box-shadow: 0 16px 35px rgba(15, 23, 42, 0.25);
      }

      .cdk-drag-placeholder {
        opacity: 0.25;
      }

      .cdk-drop-list-dragging .order-card:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .order-customer {
        font-weight: 700;
        color: #111827;
        margin-bottom: 4px;
      }

      .order-vehicle {
        font-size: 13px;
        color: #64748b;
        margin-bottom: 8px;
      }

      .order-description {
        font-size: 14px;
        color: #374151;
        margin-bottom: 12px;
      }

      .order-footer {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .order-actions {
        display: flex;
        gap: 8px;
        justify-content: space-between;
      }

      .order-actions button {
        flex: 1;
      }

      .priority-badge {
        width: fit-content;
        border-radius: 999px;
        background: #f3f4f6;
        color: #374151;
        padding: 5px 10px;
        font-size: 12px;
        font-weight: 700;
      }

      .empty-column {
        color: #64748b;
        font-size: 15px;
        padding: 20px 10px;
      }
    `,
  ],
})
export class KanbanPageComponent implements OnInit {
  private readonly serviceOrderService = inject(ServiceOrderService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  allOrders: ServiceOrder[] = [];

  customerFilter = '';
  statusFilter: ServiceOrderStatus | '' = '';

  kanban: ServiceOrderKanbanResponse = {
    ABERTA: [],
    EM_ANALISE: [],
    AGUARDANDO_CLIENTE: [],
    FINALIZADA: [],
    CANCELADA: [],
  };

  columns: Array<{ label: string; status: ServiceOrderStatus }> = [
    { label: 'Aberta', status: ServiceOrderStatus.ABERTA },
    { label: 'Em análise', status: ServiceOrderStatus.EM_ANALISE },
    { label: 'Aguardando cliente', status: ServiceOrderStatus.AGUARDANDO_CLIENTE },
    { label: 'Finalizada', status: ServiceOrderStatus.FINALIZADA },
  ];

  dropListIds = this.columns.map((column) => column.status);

  ngOnInit(): void {
    this.loadKanban();
  }

  loadKanban(): void {
    this.serviceOrderService.list().subscribe({
      next: (orders) => {
        this.allOrders = orders;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erro ao carregar kanban', err);
      },
    });
  }

  applyFilters(): void {
    const customer = this.customerFilter.trim().toLowerCase();

    const filteredOrders = this.allOrders.filter((order) => {
      const matchCustomer =
        !customer ||
        (order.customerName || '').toLowerCase().includes(customer);

      const matchStatus =
        !this.statusFilter || order.status === this.statusFilter;

      return matchCustomer && matchStatus;
    });

    this.kanban = {
      ABERTA: filteredOrders.filter((o) => o.status === ServiceOrderStatus.ABERTA),
      EM_ANALISE: filteredOrders.filter((o) => o.status === ServiceOrderStatus.EM_ANALISE),
      AGUARDANDO_CLIENTE: filteredOrders.filter(
        (o) => o.status === ServiceOrderStatus.AGUARDANDO_CLIENTE,
      ),
      FINALIZADA: filteredOrders.filter((o) => o.status === ServiceOrderStatus.FINALIZADA),
      CANCELADA: filteredOrders.filter((o) => o.status === ServiceOrderStatus.CANCELADA),
    };

    this.cdr.markForCheck();
  }

  clearFilters(): void {
    this.customerFilter = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  drop(event: CdkDragDrop<ServiceOrder[]>, newStatus: ServiceOrderStatus): void {
    const order = event.item.data as ServiceOrder;

    if (!order || order.status === newStatus) {
      return;
    }

    this.serviceOrderService.updateStatus(order.id, newStatus).subscribe({
      next: () => this.loadKanban(),
      error: (err) => console.error('Erro ao mover card', err),
    });
  }

  getOrders(status: ServiceOrderStatus): ServiceOrder[] {
    return this.kanban[status] ?? [];
  }

  goToCreate(): void {
    this.router.navigate(['/kanban/create']);
  }

  goToDetail(id: number): void {
    this.router.navigate(['/kanban', id]);
  }

  moveNext(order: ServiceOrder, event: Event): void {
    event.stopPropagation();

    const nextStatus = this.getNextStatus(order.status);

    if (!nextStatus) {
      return;
    }

    this.serviceOrderService.updateStatus(order.id, nextStatus).subscribe({
      next: () => this.loadKanban(),
      error: (err) => console.error('Erro ao avançar status', err),
    });
  }

  movePrevious(order: ServiceOrder, event: Event): void {
    event.stopPropagation();

    const previousStatus = this.getPreviousStatus(order.status);

    if (!previousStatus) {
      return;
    }

    this.serviceOrderService.updateStatus(order.id, previousStatus).subscribe({
      next: () => this.loadKanban(),
      error: (err) => console.error('Erro ao voltar status', err),
    });
  }

  getNextStatus(status: ServiceOrderStatus): ServiceOrderStatus | null {
    switch (status) {
      case ServiceOrderStatus.ABERTA:
        return ServiceOrderStatus.EM_ANALISE;
      case ServiceOrderStatus.EM_ANALISE:
        return ServiceOrderStatus.AGUARDANDO_CLIENTE;
      case ServiceOrderStatus.AGUARDANDO_CLIENTE:
        return ServiceOrderStatus.FINALIZADA;
      default:
        return null;
    }
  }

  getPreviousStatus(status: ServiceOrderStatus): ServiceOrderStatus | null {
    switch (status) {
      case ServiceOrderStatus.EM_ANALISE:
        return ServiceOrderStatus.ABERTA;
      case ServiceOrderStatus.AGUARDANDO_CLIENTE:
        return ServiceOrderStatus.EM_ANALISE;
      case ServiceOrderStatus.FINALIZADA:
        return ServiceOrderStatus.AGUARDANDO_CLIENTE;
      default:
        return null;
    }
  }
}