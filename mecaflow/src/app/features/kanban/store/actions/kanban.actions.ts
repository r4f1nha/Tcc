import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { KanbanFilters, ServiceOrder, ServiceOrderStatus, ViewMode } from '../../models/kanban.model';

export const KanbanActions = createActionGroup({
  source: 'Kanban',
  events: {
    'Load Service Orders': props<{ filters: KanbanFilters }>(),
    'Load Service Orders Success': props<{ orders: ReadonlyArray<ServiceOrder> }>(),
    'Load Service Orders Failure': props<{ error: string }>(),

    'Move Card': props<{ orderId: string; newStatus: ServiceOrderStatus }>(),
    'Move Card Success': props<{ order: ServiceOrder }>(),
    'Move Card Failure': props<{ orderId: string; previousStatus: ServiceOrderStatus; error: string }>(),

    'Create Order': props<{ order: Partial<ServiceOrder> }>(),
    'Create Order Success': props<{ order: ServiceOrder }>(),

    'Update Order': props<{ id: string; data: Partial<ServiceOrder> }>(),
    'Update Order Success': props<{ order: ServiceOrder }>(),

    'Set Filters': props<{ filters: KanbanFilters }>(),
    'Toggle View Mode': emptyProps(),
  },
});
