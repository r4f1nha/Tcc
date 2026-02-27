import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { KanbanFilters, ServiceOrder, ViewMode } from '../../models/kanban.model';
import { KanbanActions } from '../actions/kanban.actions';

export interface KanbanState extends EntityState<ServiceOrder> {
  readonly viewMode: ViewMode;
  readonly filters: KanbanFilters;
  readonly loading: boolean;
  readonly error: string | null;
}

export const kanbanAdapter: EntityAdapter<ServiceOrder> =
  createEntityAdapter<ServiceOrder>({ selectId: (o) => o.id });

const initialState: KanbanState = kanbanAdapter.getInitialState({
  viewMode: ViewMode.BOARD,
  filters: { agentId: null, status: null, overdueOnly: false },
  loading: false,
  error: null,
});

export const kanbanReducer = createReducer(
  initialState,

  on(KanbanActions.loadServiceOrders, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(KanbanActions.loadServiceOrdersSuccess, (state, { orders }) =>
    kanbanAdapter.setAll([...orders], { ...state, loading: false }),
  ),
  on(KanbanActions.loadServiceOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Optimistic update for drag-and-drop
  on(KanbanActions.moveCard, (state, { orderId, newStatus }) =>
    kanbanAdapter.updateOne(
      { id: orderId, changes: { status: newStatus } as Partial<ServiceOrder> },
      state,
    ),
  ),
  on(KanbanActions.moveCardSuccess, (state, { order }) =>
    kanbanAdapter.upsertOne(order, state),
  ),
  // Rollback on failure
  on(KanbanActions.moveCardFailure, (state, { orderId, previousStatus }) =>
    kanbanAdapter.updateOne(
      { id: orderId, changes: { status: previousStatus } as Partial<ServiceOrder> },
      state,
    ),
  ),

  on(KanbanActions.createOrderSuccess, (state, { order }) =>
    kanbanAdapter.addOne(order, state),
  ),
  on(KanbanActions.updateOrderSuccess, (state, { order }) =>
    kanbanAdapter.upsertOne(order, state),
  ),

  on(KanbanActions.setFilters, (state, { filters }) => ({
    ...state,
    filters,
  })),

  on(KanbanActions.toggleViewMode, (state) => ({
    ...state,
    viewMode: state.viewMode === ViewMode.BOARD ? ViewMode.LIST : ViewMode.BOARD,
  })),
);
