import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

import {
  Appointment,
  AppointmentStatus,
  CalendarView,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from '../../models/appointment.model';

import { AppointmentActions } from '../../store/actions/appointment.actions';
import * as AppointmentSelectors from '../../store/selectors/appointment.selectors';

interface CalendarEvent {
  appointment: Appointment;
  top: number;
  height: number;
  color: string;
  textColor: string;
}

@Component({
  selector: 'app-agenda-page',
  standalone: true,
  imports: [DatePipe, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row mb-1">
      <div class="col-12">
        <div class="content-header d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <i class="fas fa-calendar-alt header-icon mr-2"></i>

            <button (click)="goToToday()" class="btn btn-outline-secondary btn-sm mr-2">
              Hoje
            </button>

            <div class="btn-group btn-group-sm mr-3">
              <button class="btn btn-outline-secondary" (click)="navigate(-1)">
                <i class="fas fa-chevron-left"></i>
              </button>

              <button class="btn btn-outline-secondary" (click)="navigate(1)">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>

            <h5 class="mb-0">{{ monthYearLabel() }}</h5>
          </div>

          <div class="d-flex align-items-center">
            <div class="btn-group btn-group-sm mr-2">
              @for (v of views; track v.value) {
                <button
                  type="button"
                  class="btn"
                  [class.btn-primary]="currentView() === v.value"
                  [class.btn-outline-secondary]="currentView() !== v.value"
                  (click)="currentView.set(v.value)"
                >
                  {{ v.label }}
                </button>
              }
            </div>

            <button class="btn btn-primary btn-sm" (click)="openCreateModal()">
              <i class="fas fa-plus mr-1"></i>
              Agendar
            </button>
          </div>
        </div>
      </div>
    </div>

    @if (loading()) {
      <div class="alert alert-info py-2">
        Carregando agendas...
      </div>
    }

    @if (error()) {
      <div class="alert alert-danger py-2">
        {{ error() }}
      </div>
    }

    @if (currentView() === CalendarView.WEEK) {
      <div class="card" style="overflow:hidden;">
        <div class="card-body p-0">
          <div
            class="border-bottom"
            style="display:grid;grid-template-columns:60px repeat(7,1fr);"
          >
            <div class="p-2"></div>

            @for (day of weekDays(); track day.date) {
              <div class="p-2 text-center border-left">
                <p
                  class="mb-0"
                  style="font-size:11px;font-weight:600;text-transform:uppercase;color:#6c757d;"
                >
                  {{ day.weekday }}
                </p>

                <div
                  class="rounded-circle d-inline-flex align-items-center justify-content-center mt-1"
                  style="width:32px;height:32px;font-size:1rem;font-weight:600;"
                  [style.background]="day.isToday ? '#4F6EF7' : 'transparent'"
                  [style.color]="day.isToday ? '#fff' : '#333'"
                >
                  {{ day.dayNumber }}
                </div>
              </div>
            }
          </div>

          <div style="overflow-y:auto;max-height:calc(100vh - 280px);">
            <div
              style="display:grid;grid-template-columns:60px repeat(7,1fr);position:relative;"
            >
              <div>
                @for (hour of hours; track hour) {
                  <div
                    style="height:60px;display:flex;align-items:flex-start;justify-content:flex-end;padding-right:8px;padding-top:0;margin-top:-8px;"
                  >
                    <span style="font-size:11px;color:#6c757d;">
                      {{ formatHour(hour) }}
                    </span>
                  </div>
                }
              </div>

              @for (day of weekDays(); track day.date; let dayIdx = $index) {
                <div class="border-left position-relative">
                  @for (hour of hours; track hour) {
                    <div
                      class="border-bottom"
                      title="Clique para agendar"
                      style="height:60px;cursor:pointer;"
                      (click)="openCreateModalAt(day.date, hour)"
                    ></div>
                  }

                  @if (day.isToday) {
                    <div
                      class="position-absolute d-flex align-items-center"
                      style="left:0;right:0;z-index:10;pointer-events:none;"
                      [style.top.px]="currentTimeTop()"
                    >
                      <div
                        class="rounded-circle bg-danger"
                        style="width:10px;height:10px;margin-left:-5px;"
                      ></div>
                      <div class="flex-grow-1 bg-danger" style="height:2px;"></div>
                    </div>
                  }

                  @for (event of getEventsForDay(dayIdx); track event.appointment.id) {
                    <div
                      class="position-absolute rounded px-1 py-1"
                      style="left:4px;right:4px;overflow:hidden;cursor:pointer;z-index:20;"
                      [style.top.px]="event.top"
                      [style.height.px]="event.height"
                      [style.background]="event.color"
                      [style.color]="event.textColor"
                      [style.border-left]="'3px solid ' + event.textColor"
                      (click)="openEditModal(event.appointment); $event.stopPropagation()"
                    >
                      <p
                        class="mb-0 font-weight-600"
                        style="font-size:11px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"
                      >
                        {{ event.appointment.title }}
                      </p>

                      <p
                        class="mb-0"
                        style="font-size:10px;opacity:0.8;overflow:hidden;white-space:nowrap;"
                      >
                        {{ event.appointment.startAt | date:'HH:mm' }}
                        -
                        {{ event.appointment.endAt | date:'HH:mm' }}
                      </p>

                      @if (event.height > 50) {
                        <p
                          class="mb-0"
                          style="font-size:10px;opacity:0.7;overflow:hidden;white-space:nowrap;"
                        >
                          {{ event.appointment.serviceType }}
                        </p>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }

    @if (currentView() === CalendarView.DAY) {
      <div class="card">
        <div class="card-body">
          @for (event of appointmentsBySelectedDate(); track event.id) {
            <div
              class="card mb-2 border-left-primary"
              style="cursor:pointer;"
              [style.border-left-color]="getStatusColor(getStatus(event))"
              (click)="openEditModal(event)"
            >
              <div class="card-body py-2 d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <div class="text-center mr-3" style="min-width:60px;">
                    <p class="mb-0 font-weight-600" style="font-size:0.85rem;">
                      {{ event.startAt | date:'HH:mm' }}
                    </p>

                    <p class="mb-0 text-muted" style="font-size:0.75rem;">
                      {{ event.endAt | date:'HH:mm' }}
                    </p>
                  </div>

                  <div>
                    <h6 class="mb-0">{{ event.title }}</h6>
                    <small class="text-muted">
                      {{ event.serviceType }}
                    </small>
                  </div>
                </div>

                <span class="badge badge-pill" [class]="getStatusBadgeClass(getStatus(event))">
                  {{ getStatusLabel(getStatus(event)) }}
                </span>
              </div>
            </div>
          } @empty {
            <div class="text-center text-muted py-5">
              <p>Nenhum agendamento para esta data</p>
            </div>
          }
        </div>
      </div>
    }

    @if (currentView() === CalendarView.MONTH) {
      <div class="card">
        <div class="card-body p-0">
          <div
            style="display:grid;grid-template-columns:repeat(7,1fr);"
            class="border-bottom"
          >
            @for (wd of weekdayLabels; track wd) {
              <div
                class="text-center text-muted py-2"
                style="font-size:11px;font-weight:600;text-transform:uppercase;"
              >
                {{ wd }}
              </div>
            }
          </div>

          <div style="display:grid;grid-template-columns:repeat(7,1fr);">
            @for (cell of monthCells(); track cell.date) {
              <div
                class="border-right border-bottom p-1"
                style="min-height:100px;cursor:pointer;"
                [style.background]="cell.isCurrentMonth ? '#fff' : '#f8f9fa'"
                (click)="openCreateModalAt(cell.date, 9)"
              >
                <div
                  class="rounded-circle d-inline-flex align-items-center justify-content-center mb-1"
                  style="width:24px;height:24px;font-size:0.75rem;font-weight:600;"
                  [style.background]="cell.isToday ? '#4F6EF7' : 'transparent'"
                  [style.color]="cell.isToday ? '#fff' : (cell.isCurrentMonth ? '#333' : '#adb5bd')"
                >
                  {{ cell.dayNumber }}
                </div>

                @for (evt of cell.events; track evt.id) {
                  <div
                    class="rounded mb-1 px-1"
                    style="font-size:10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"
                    [style.background]="getStatusBg(getStatus(evt))"
                    [style.color]="getStatusColor(getStatus(evt))"
                    (click)="openEditModal(evt); $event.stopPropagation()"
                  >
                    {{ evt.startAt | date:'HH:mm' }} {{ evt.title }}
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }

    @if (modalOpen()) {
      <div
        class="position-fixed"
        style="inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;"
      >
        <div class="card shadow" style="width:100%;max-width:620px;">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0" style="user-select: none;">
              {{ editingAppointmentId() ? 'Editar agenda' : 'Novo agendamento' }}
            </h5>

            <button class="btn btn-sm btn-outline-secondary" (click)="closeModal()">
              X
            </button>
          </div>

          <div class="card-body">
            <div class="form-group">
              <label>Título</label>
              <input
                class="form-control"
                [(ngModel)]="form.title"
                placeholder="Ex: Troca de óleo"
              />
            </div>

            <div class="form-group">
              <label>Descrição</label>
              <textarea
                class="form-control"
                rows="3"
                [(ngModel)]="form.description"
                placeholder="Detalhes do agendamento"
              ></textarea>
            </div>

            <div class="form-group">
              <label>Serviço</label>
              <input
                class="form-control"
                [(ngModel)]="form.serviceType"
                placeholder="Ex: Revisão, Freios, Motor"
              />
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Início</label>
                  <input
                    type="datetime-local"
                    class="form-control"
                    [(ngModel)]="form.startAt"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label>Fim</label>
                  <input
                    type="datetime-local"
                    class="form-control"
                    [(ngModel)]="form.endAt"
                  />
                </div>
              </div>
            </div>

            @if (editingAppointmentId()) {
              <div class="form-group">
                <label>Status</label>
                <select class="form-control" [(ngModel)]="form.status">
                  <option [value]="AppointmentStatus.PENDING">Pendente</option>
                  <option [value]="AppointmentStatus.CONFIRMED">Confirmado</option>
                  <option [value]="AppointmentStatus.CANCELLED">Cancelado</option>
                  <option [value]="AppointmentStatus.DONE">Concluído</option>
                </select>
              </div>
            }
          </div>

          <div class="card-footer d-flex justify-content-between">
            <div>
              @if (editingAppointmentId()) {
                <button class="btn btn-danger" (click)="deleteAppointment()">
                  Excluir
                </button>
              }
            </div>

            <div>
              <button class="btn btn-outline-secondary mr-2" (click)="closeModal()">
                Cancelar
              </button>

              <button class="btn btn-primary" (click)="saveAppointment()">
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AgendaPageComponent {
  private readonly store = inject(Store);

  protected readonly CalendarView = CalendarView;
  protected readonly AppointmentStatus = AppointmentStatus;

  readonly appointments = signal<ReadonlyArray<Appointment>>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly currentView = signal(CalendarView.WEEK);
  readonly selectedDate = signal(new Date().toISOString().split('T')[0]);

  readonly modalOpen = signal(false);
  readonly editingAppointmentId = signal<number | null>(null);

  readonly form = {
    title: '',
    description: '',
    serviceType: '',
    startAt: '',
    endAt: '',
    status: AppointmentStatus.PENDING,
  };

  readonly views: ReadonlyArray<{ label: string; value: CalendarView }> = [
    { label: 'Dia', value: CalendarView.DAY },
    { label: 'Semana', value: CalendarView.WEEK },
    { label: 'Mês', value: CalendarView.MONTH },
  ];

  readonly hours = Array.from({ length: 13 }, (_, i) => i + 7);

  readonly weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  readonly appointmentsBySelectedDate = computed(() =>
    this.appointments().filter((appointment) =>
      appointment.startAt?.startsWith(this.selectedDate())
    )
  );

  readonly weekDays = computed(() => {
    const date = new Date(this.selectedDate() + 'T12:00:00');
    const startOfWeek = new Date(date);

    startOfWeek.setDate(date.getDate() - date.getDay());

    const today = new Date().toISOString().split('T')[0];

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);

      const dateStr = d.toISOString().split('T')[0];

      return {
        date: dateStr,
        weekday: this.weekdayLabels[d.getDay()],
        dayNumber: d.getDate(),
        isToday: dateStr === today,
      };
    });
  });

  readonly monthYearLabel = computed(() => {
    const d = new Date(this.selectedDate() + 'T12:00:00');

    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  });

  readonly currentTimeTop = computed(() => {
    const now = new Date();
    return (now.getHours() - 7) * 60 + now.getMinutes();
  });

  readonly monthCells = computed(() => {
    const date = new Date(this.selectedDate() + 'T12:00:00');
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date().toISOString().split('T')[0];

    const cells: Array<{
      date: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      events: ReadonlyArray<Appointment>;
    }> = [];

    for (let i = firstDay.getDay() - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      const ds = d.toISOString().split('T')[0];

      cells.push({
        date: ds,
        dayNumber: d.getDate(),
        isCurrentMonth: false,
        isToday: false,
        events: this.appointments().filter((e) => e.startAt?.startsWith(ds)),
      });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const ds = d.toISOString().split('T')[0];

      cells.push({
        date: ds,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: ds === today,
        events: this.appointments().filter((e) => e.startAt?.startsWith(ds)),
      });
    }

    const rem = 42 - cells.length;

    for (let i = 1; i <= rem; i++) {
      const d = new Date(year, month + 1, i);
      const ds = d.toISOString().split('T')[0];

      cells.push({
        date: ds,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: false,
        events: this.appointments().filter((e) => e.startAt?.startsWith(ds)),
      });
    }

    return cells;
  });

  constructor() {
    this.store
      .select(AppointmentSelectors.selectAllAppointments)
      .subscribe((appointments) => {
        this.appointments.set(appointments);
      });

    this.store
      .select(AppointmentSelectors.selectAppointmentLoading)
      .subscribe((loading) => {
        this.loading.set(loading);
      });

    this.store
      .select(AppointmentSelectors.selectAppointmentError)
      .subscribe((error) => {
        this.error.set(error);
      });

    this.loadAppointments();
  }

  loadAppointments(): void {
    this.store.dispatch(
      AppointmentActions.loadAppointments({
        filters: {
          date: this.selectedDate(),
          status: null,
          agentId: null,
        },
      })
    );
  }

  navigate(dir: number): void {
    const current = new Date(this.selectedDate() + 'T12:00:00');

    if (this.currentView() === CalendarView.MONTH) {
      current.setMonth(current.getMonth() + dir);
    } else if (this.currentView() === CalendarView.DAY) {
      current.setDate(current.getDate() + dir);
    } else {
      current.setDate(current.getDate() + dir * 7);
    }

    this.selectedDate.set(current.toISOString().split('T')[0]);
    this.loadAppointments();
  }

  goToToday(): void {
    this.selectedDate.set(new Date().toISOString().split('T')[0]);
    this.loadAppointments();
  }

  selectDay(date: string): void {
    this.selectedDate.set(date);
    this.currentView.set(CalendarView.DAY);
    this.loadAppointments();
  }

  openCreateModal(): void {
    this.openCreateModalAt(this.selectedDate(), 9);
  }

  openCreateModalAt(date: string, hour: number): void {
    this.editingAppointmentId.set(null);

    const start = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    this.form.title = '';
    this.form.description = '';
    this.form.serviceType = '';
    this.form.startAt = this.toDateTimeLocal(start);
    this.form.endAt = this.toDateTimeLocal(end);
    this.form.status = AppointmentStatus.PENDING;

    this.modalOpen.set(true);
  }

  openEditModal(appointment: Appointment): void {
    this.editingAppointmentId.set(Number(appointment.id));

    this.form.title = appointment.title;
    this.form.description = appointment.description;
    this.form.serviceType = appointment.serviceType;
    this.form.startAt = this.toDateTimeLocal(new Date(appointment.startAt));
    this.form.endAt = this.toDateTimeLocal(new Date(appointment.endAt));
    this.form.status = this.getStatus(appointment);

    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.editingAppointmentId.set(null);
  }

  saveAppointment(): void {
    if (!this.form.title || !this.form.startAt || !this.form.endAt) {
      alert('Preencha título, início e fim.');
      return;
    }

    const id = this.editingAppointmentId();

    if (id) {
      const payload: UpdateAppointmentPayload = {
        title: this.form.title,
        description: this.form.description,
        serviceType: this.form.serviceType,
        startAt: new Date(this.form.startAt).toISOString(),
        endAt: new Date(this.form.endAt).toISOString(),
        status: this.form.status,
      };

      this.store.dispatch(
        AppointmentActions.updateAppointment({
          id,
          payload,
        })
      );

      this.closeModal();
      return;
    }

    const payload: CreateAppointmentPayload = {
      title: this.form.title,
      description: this.form.description,
      serviceType: this.form.serviceType,
      startAt: new Date(this.form.startAt).toISOString(),
      endAt: new Date(this.form.endAt).toISOString(),
    };

    this.store.dispatch(
      AppointmentActions.createAppointment({
        payload,
      })
    );

    this.closeModal();
  }

  deleteAppointment(): void {
    const id = this.editingAppointmentId();

    if (!id) return;

    const confirmed = confirm('Deseja excluir este agendamento?');

    if (!confirmed) return;

    this.store.dispatch(
      AppointmentActions.deleteAppointment({
        id,
      })
    );

    this.closeModal();
  }

  formatHour(hour: number): string {
    return `${hour.toString().padStart(2, '0')}:00`;
  }

  getEventsForDay(dayIdx: number): ReadonlyArray<CalendarEvent> {
    const days = this.weekDays();

    if (!days[dayIdx]) return [];

    const dateStr = days[dayIdx].date;

    return this.appointments()
      .filter((appointment) => appointment.startAt?.startsWith(dateStr))
      .map((appointment) => {
        const start = new Date(appointment.startAt);
        const end = new Date(appointment.endAt);
        const colors = this.getEventColors(this.getStatus(appointment));

        return {
          appointment,
          top: Math.max(0, (start.getHours() - 7) * 60 + start.getMinutes()),
          height: Math.max(30, (end.getTime() - start.getTime()) / 60000),
          color: colors.bg,
          textColor: colors.text,
        };
      });
  }

  getStatus(appointment: Appointment): AppointmentStatus {
    return appointment.status ?? AppointmentStatus.PENDING;
  }

  getEventColors(status: AppointmentStatus): { bg: string; text: string } {
    const colors: Record<AppointmentStatus, { bg: string; text: string }> = {
      [AppointmentStatus.PENDING]: {
        bg: 'rgba(245,158,11,0.15)',
        text: '#f59e0b',
      },
      [AppointmentStatus.CONFIRMED]: {
        bg: 'rgba(16,185,129,0.15)',
        text: '#10b981',
      },
      [AppointmentStatus.CANCELLED]: {
        bg: 'rgba(239,68,68,0.12)',
        text: '#ef4444',
      },
      [AppointmentStatus.DONE]: {
        bg: 'rgba(100,116,139,0.12)',
        text: '#64748b',
      },
    };

    return colors[status];
  }

  getStatusColor(status: AppointmentStatus): string {
    return this.getEventColors(status).text;
  }

  getStatusBg(status: AppointmentStatus): string {
    return this.getEventColors(status).bg;
  }

  getStatusBadgeClass(status: AppointmentStatus): string {
    const classes: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: 'badge-warning',
      [AppointmentStatus.CONFIRMED]: 'badge-success',
      [AppointmentStatus.CANCELLED]: 'badge-danger',
      [AppointmentStatus.DONE]: 'badge-secondary',
    };

    return classes[status];
  }

  getStatusLabel(status: AppointmentStatus): string {
    const labels: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: 'Pendente',
      [AppointmentStatus.CONFIRMED]: 'Confirmado',
      [AppointmentStatus.CANCELLED]: 'Cancelado',
      [AppointmentStatus.DONE]: 'Concluído',
    };

    return labels[status];
  }

  private toDateTimeLocal(date: Date): string {
    const pad = (value: number) => value.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hour}:${minute}`;
  }
}