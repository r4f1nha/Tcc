import { createFeatureSelector, createSelector } from '@ngrx/store';
import { KanbanState, kanbanAdapter } from '../reducers/kanban.reducer';
import { ServiceOrderStatus } from '../../models/kanban.model';

export const selectKanbanState = createFeatureSelector<KanbanState>('kanban');

const { selectAll } = kanbanAdapter.getSelectors();

export const selectAllOrders = createSelector(selectKanbanState, selectAll);

export const selectViewMode = createSelector(selectKanbanState, (s) => s.viewMode);
export const selectKanbanFilters = createSelector(selectKanbanState, (s) => s.filters);
export const selectKanbanLoading = createSelector(selectKanbanState, (s) => s.loading);

export const selectOrdersByColumn = (status: ServiceOrderStatus) =>
  createSelector(selectAllOrders, (orders) =>
    orders.filter((o) => o.status === status),
  );

export const selectOverdueOrders = createSelector(selectAllOrders, (orders) => {
  const now = new Date().toISOString();
  return orders.filter(
    (o) => o.deadline < now && o.status !== ServiceOrderStatus.COMPLETED,
  );
});
