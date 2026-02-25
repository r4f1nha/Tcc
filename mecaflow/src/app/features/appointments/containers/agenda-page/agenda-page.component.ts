import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppointmentActions } from '../../store/actions/appointment.actions';
import {
  selectAllAppointments,
  selectAppointmentLoading,
  selectCurrentView,
  selectPendingCount,
  selectSelectedDate,
} from '../../store/selectors/appointment.selectors';
import { AppointmentStatus, CalendarView } from '../../models/appointment.model';
import { Appointment } from '../../models/appointment.model';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-agenda-page',
  standalone: true,
  imports: [DatePipe, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Agenda</h1>
          <p class="text-sm text-slate-400 mt-1">Gerencie seus agendamentos</p>
        </div>
        <div class="flex items-center gap-3">
          <!-- View Toggle -->
          <div class="flex bg-[#1a1d27] rounded-lg p-1">
            @for (v of views; track v.value) {
              <button
                (click)="onChangeView(v.value)"
                [class]="currentView() === v.value ? 'bg-[#4F6EF7] text-white' : 'text-slate-400 hover:text-white'"
                class="px-3 py-1.5 rounded-md text-xs font-medium transition-all">
                {{ v.label }}
              </button>
            }
          </div>
          <button class="px-4 py-2 bg-[#4F6EF7] hover:bg-[#3d5ae0] text-white text-sm font-medium rounded-lg transition-colors">
            + Agendar
          </button>
        </div>
      </div>

      <!-- Date Navigation -->
      <div class="flex items-center gap-4">
        <button (click)="navigateDate(-1)" class="p-2 text-slate-400 hover:text-white hover:bg-[#22263a] rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 class="text-lg font-semibold text-white">{{ selectedDate() | date:'dd MMMM yyyy' }}</h2>
        <button (click)="navigateDate(1)" class="p-2 text-slate-400 hover:text-white hover:bg-[#22263a] rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        <button (click)="goToToday()" class="text-xs text-[#4F6EF7] hover:text-[#3d5ae0] font-medium ml-2">Hoje</button>
        @if (pendingCount() > 0) {
          <span class="bg-amber-500/10 text-amber-400 text-xs px-2 py-1 rounded-full font-medium">
            {{ pendingCount() }} pendente(s)
          </span>
        }
      </div>

      <!-- Appointments List -->
      <div class="space-y-3">
        @if (loading()) {
          @for (i of [1,2,3]; track i) {
            <app-skeleton variant="card" />
          }
        } @else {
          @for (appointment of appointments(); track appointment.id) {
            <div class="bg-[#22263a] rounded-xl border p-4 flex items-center justify-between transition-all"
              [class]="getStatusBorderClass(appointment.status)">
              <div class="flex items-center gap-4">
                <div class="text-center">
                  <p class="text-xs text-slate-400 font-mono">{{ appointment.startTime | date:'HH:mm' }}</p>
                  <p class="text-xs text-slate-500 font-mono">{{ appointment.endTime | date:'HH:mm' }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-white">{{ appointment.title }}</h3>
                  <p class="text-xs text-slate-400">{{ appointment.leadName }} · {{ appointment.serviceType }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-1 rounded-full font-medium" [class]="getStatusBadgeClass(appointment.status)">
                  {{ getStatusLabel(appointment.status) }}
                </span>
                @if (appointment.status === AppointmentStatus.PENDING) {
                  <button
                    (click)="onConfirm(appointment.id)"
                    class="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors">
                    Confirmar
                  </button>
                  <button
                    (click)="onCancel(appointment.id)"
                    class="text-xs px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                    Cancelar
                  </button>
                }
              </div>
            </div>
          } @empty {
            <div class="text-center py-12 text-slate-500 text-sm">
              Nenhum agendamento para esta data
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class AgendaPageComponent implements OnInit {
  private readonly store = inject(Store);

  readonly appointments = this.store.selectSignal(selectAllAppointments);
  readonly loading = this.store.selectSignal(selectAppointmentLoading);
  readonly selectedDate = this.store.selectSignal(selectSelectedDate);
  readonly currentView = this.store.selectSignal(selectCurrentView);
  readonly pendingCount = this.store.selectSignal(selectPendingCount);

  protected readonly AppointmentStatus = AppointmentStatus;

  readonly views: ReadonlyArray<{ label: string; value: CalendarView }> = [
    { label: 'Mês', value: CalendarView.MONTH },
    { label: 'Semana', value: CalendarView.WEEK },
    { label: 'Dia', value: CalendarView.DAY },
  ];

  ngOnInit(): void {
    this.store.dispatch(
      AppointmentActions.loadAppointments({
        filters: { date: this.selectedDate(), status: null, agentId: null },
      }),
    );
  }

  onChangeView(view: CalendarView): void {
    this.store.dispatch(AppointmentActions.changeView({ view }));
  }

  navigateDate(direction: number): void {
    const current = new Date(this.selectedDate());
    current.setDate(current.getDate() + direction);
    this.store.dispatch(AppointmentActions.selectDate({ date: current.toISOString().split('T')[0] }));
  }

  goToToday(): void {
    this.store.dispatch(AppointmentActions.selectDate({ date: new Date().toISOString().split('T')[0] }));
  }

  onConfirm(id: string): void {
    this.store.dispatch(AppointmentActions.confirmAppointment({ id }));
  }

  onCancel(id: string): void {
    this.store.dispatch(AppointmentActions.cancelAppointment({ id }));
  }

  getStatusBorderClass(status: AppointmentStatus): string {
    const map: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: 'border-l-4 border-l-amber-500 border-slate-700/50',
      [AppointmentStatus.CONFIRMED]: 'border-l-4 border-l-emerald-500 border-slate-700/50',
      [AppointmentStatus.CANCELLED]: 'border-l-4 border-l-red-500 border-slate-700/50',
      [AppointmentStatus.DONE]: 'border-l-4 border-l-slate-500 border-slate-700/50',
    };
    return map[status];
  }

  getStatusBadgeClass(status: AppointmentStatus): string {
    const map: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: 'bg-amber-500/10 text-amber-400',
      [AppointmentStatus.CONFIRMED]: 'bg-emerald-500/10 text-emerald-400',
      [AppointmentStatus.CANCELLED]: 'bg-red-500/10 text-red-400',
      [AppointmentStatus.DONE]: 'bg-slate-500/10 text-slate-400',
    };
    return map[status];
  }

  getStatusLabel(status: AppointmentStatus): string {
    const map: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: 'Pendente',
      [AppointmentStatus.CONFIRMED]: 'Confirmado',
      [AppointmentStatus.CANCELLED]: 'Cancelado',
      [AppointmentStatus.DONE]: 'Concluído',
    };
    return map[status];
  }
}
