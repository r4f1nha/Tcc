import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AppointmentStatus, CalendarView, Appointment } from '../../models/appointment.model';

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
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Cabeçalho -->
    <div class="row mb-1">
      <div class="col-12">
        <div class="content-header d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <i class="fas fa-calendar-alt header-icon mr-2"></i>
            <button (click)="goToToday()" class="btn btn-outline-secondary btn-sm mr-2">Hoje</button>
            <div class="btn-group btn-group-sm mr-3">
              <button class="btn btn-outline-secondary" (click)="navigateWeek(-1)">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="btn btn-outline-secondary" (click)="navigateWeek(1)">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            <h5 class="mb-0">{{ monthYearLabel() }}</h5>
          </div>
          <div class="d-flex align-items-center">
            <div class="btn-group btn-group-sm mr-2">
              @for (v of views; track v.value) {
                <button type="button" class="btn"
                  [class.btn-primary]="currentView() === v.value"
                  [class.btn-outline-secondary]="currentView() !== v.value"
                  (click)="currentView.set(v.value)">
                  {{ v.label }}
                </button>
              }
            </div>
            <button class="btn btn-primary btn-sm">
              <i class="fas fa-plus mr-1"></i>Agendar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Week View -->
    @if (currentView() === CalendarView.WEEK) {
      <div class="card" style="overflow:hidden;">
        <div class="card-body p-0">
          <!-- Day Headers -->
          <div class="border-bottom" style="display:grid;grid-template-columns:60px repeat(7,1fr);">
            <div class="p-2"></div>
            @for (day of weekDays(); track day.date) {
              <div class="p-2 text-center border-left">
                <p class="mb-0" style="font-size:11px;font-weight:600;text-transform:uppercase;color:#6c757d;">{{ day.weekday }}</p>
                <div class="rounded-circle d-inline-flex align-items-center justify-content-center mt-1"
                  style="width:32px;height:32px;font-size:1rem;font-weight:600;"
                  [style.background]="day.isToday ? '#4F6EF7' : 'transparent'"
                  [style.color]="day.isToday ? '#fff' : '#333'">
                  {{ day.dayNumber }}
                </div>
              </div>
            }
          </div>
          <!-- Time Grid -->
          <div style="overflow-y:auto;max-height:calc(100vh - 280px);">
            <div style="display:grid;grid-template-columns:60px repeat(7,1fr);position:relative;">
              <div>
                @for (hour of hours; track hour) {
                  <div style="height:60px;display:flex;align-items:flex-start;justify-content:flex-end;padding-right:8px;padding-top:0;margin-top:-8px;">
                    <span style="font-size:11px;color:#6c757d;">{{ formatHour(hour) }}</span>
                  </div>
                }
              </div>
              @for (day of weekDays(); track day.date; let dayIdx = $index) {
                <div class="border-left position-relative">
                  @for (hour of hours; track hour) {
                    <div class="border-bottom" style="height:60px;"></div>
                  }
                  @if (day.isToday) {
                    <div class="position-absolute d-flex align-items-center" style="left:0;right:0;z-index:10;" [style.top.px]="currentTimeTop()">
                      <div class="rounded-circle bg-danger" style="width:10px;height:10px;margin-left:-5px;"></div>
                      <div class="flex-grow-1 bg-danger" style="height:2px;"></div>
                    </div>
                  }
                  @for (event of getEventsForDay(dayIdx); track event.appointment.id) {
                    <div class="position-absolute rounded px-1 py-1" style="left:4px;right:4px;overflow:hidden;cursor:pointer;z-index:20;"
                      [style.top.px]="event.top"
                      [style.height.px]="event.height"
                      [style.background]="event.color"
                      [style.color]="event.textColor"
                      [style.border-left]="'3px solid ' + event.textColor">
                      <p class="mb-0 font-weight-600" style="font-size:11px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">{{ event.appointment.title }}</p>
                      <p class="mb-0" style="font-size:10px;opacity:0.8;overflow:hidden;white-space:nowrap;">
                        {{ event.appointment.startTime | date:'HH:mm' }} - {{ event.appointment.endTime | date:'HH:mm' }}
                      </p>
                      @if (event.height > 50) {
                        <p class="mb-0" style="font-size:10px;opacity:0.7;overflow:hidden;white-space:nowrap;">{{ event.appointment.leadName }}</p>
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

    <!-- Day View -->
    @if (currentView() === CalendarView.DAY) {
      <div class="card">
        <div class="card-body">
          @for (event of allMockEvents; track event.id) {
            <div class="card mb-2 border-left-primary" [style.border-left-color]="getStatusColor(event.status)">
              <div class="card-body py-2 d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <div class="text-center mr-3" style="min-width:60px;">
                    <p class="mb-0 font-weight-600" style="font-size:0.85rem;">{{ event.startTime | date:'HH:mm' }}</p>
                    <p class="mb-0 text-muted" style="font-size:0.75rem;">{{ event.endTime | date:'HH:mm' }}</p>
                  </div>
                  <div>
                    <h6 class="mb-0">{{ event.title }}</h6>
                    <small class="text-muted">{{ event.leadName }} · {{ event.serviceType }}</small>
                  </div>
                </div>
                <span class="badge badge-pill" [class]="getStatusBadgeClass(event.status)">
                  {{ getStatusLabel(event.status) }}
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

    <!-- Month View -->
    @if (currentView() === CalendarView.MONTH) {
      <div class="card">
        <div class="card-body p-0">
          <div style="display:grid;grid-template-columns:repeat(7,1fr);" class="border-bottom">
            @for (wd of weekdayLabels; track wd) {
              <div class="text-center text-muted py-2" style="font-size:11px;font-weight:600;text-transform:uppercase;">{{ wd }}</div>
            }
          </div>
          <div style="display:grid;grid-template-columns:repeat(7,1fr);">
            @for (cell of monthCells(); track cell.date) {
              <div class="border-right border-bottom p-1" style="min-height:100px;"
                [style.background]="cell.isCurrentMonth ? '#fff' : '#f8f9fa'">
                <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-1"
                  style="width:24px;height:24px;font-size:0.75rem;font-weight:600;"
                  [style.background]="cell.isToday ? '#4F6EF7' : 'transparent'"
                  [style.color]="cell.isToday ? '#fff' : (cell.isCurrentMonth ? '#333' : '#adb5bd')">
                  {{ cell.dayNumber }}
                </div>
                @for (evt of cell.events; track evt.id) {
                  <div class="rounded mb-1 px-1" style="font-size:10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"
                    [style.background]="getStatusBg(evt.status)"
                    [style.color]="getStatusColor(evt.status)">
                    {{ evt.startTime | date:'HH:mm' }} {{ evt.title }}
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`:host { display: block; }`],
})
export class AgendaPageComponent {
  protected readonly CalendarView = CalendarView;

  readonly currentView = signal(CalendarView.WEEK);
  readonly selectedDate = signal(new Date().toISOString().split('T')[0]);

  readonly views: ReadonlyArray<{ label: string; value: CalendarView }> = [
    { label: 'Dia', value: CalendarView.DAY },
    { label: 'Semana', value: CalendarView.WEEK },
    { label: 'Mes', value: CalendarView.MONTH },
  ];

  readonly hours = Array.from({ length: 13 }, (_, i) => i + 7);
  readonly weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  readonly allMockEvents: ReadonlyArray<Appointment> = this.generateMockEvents();

  readonly weekDays = computed(() => {
    const date = new Date(this.selectedDate() + 'T12:00:00');
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const today = new Date().toISOString().split('T')[0];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      return { date: dateStr, weekday: this.weekdayLabels[d.getDay()], dayNumber: d.getDate(), isToday: dateStr === today };
    });
  });

  readonly monthYearLabel = computed(() => {
    const d = new Date(this.selectedDate() + 'T12:00:00');
    const months = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
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
    const cells: Array<{ date: string; dayNumber: number; isCurrentMonth: boolean; isToday: boolean; events: ReadonlyArray<Appointment> }> = [];
    for (let i = firstDay.getDay() - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      cells.push({ date: d.toISOString().split('T')[0], dayNumber: d.getDate(), isCurrentMonth: false, isToday: false, events: [] });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const ds = d.toISOString().split('T')[0];
      cells.push({ date: ds, dayNumber: i, isCurrentMonth: true, isToday: ds === today, events: this.allMockEvents.filter(e => e.startTime.startsWith(ds)) });
    }
    const rem = 42 - cells.length;
    for (let i = 1; i <= rem; i++) {
      const d = new Date(year, month + 1, i);
      cells.push({ date: d.toISOString().split('T')[0], dayNumber: i, isCurrentMonth: false, isToday: false, events: [] });
    }
    return cells;
  });

  navigateWeek(dir: number): void {
    const c = new Date(this.selectedDate() + 'T12:00:00');
    c.setDate(c.getDate() + dir * 7);
    this.selectedDate.set(c.toISOString().split('T')[0]);
  }

  goToToday(): void {
    this.selectedDate.set(new Date().toISOString().split('T')[0]);
  }

  formatHour(h: number): string {
    return `${h.toString().padStart(2, '0')}:00`;
  }

  getEventsForDay(dayIdx: number): ReadonlyArray<CalendarEvent> {
    const days = this.weekDays();
    if (!days[dayIdx]) return [];
    const dateStr = days[dayIdx].date;
    return this.allMockEvents.filter(a => a.startTime.startsWith(dateStr)).map(a => {
      const s = new Date(a.startTime), e = new Date(a.endTime);
      const colors = this.getEventColors(a.status);
      return { appointment: a, top: Math.max(0, (s.getHours() - 7) * 60 + s.getMinutes()), height: Math.max(30, (e.getTime() - s.getTime()) / 60000), color: colors.bg, textColor: colors.text };
    });
  }

  getEventColors(status: AppointmentStatus): { bg: string; text: string } {
    const m: Record<AppointmentStatus, { bg: string; text: string }> = {
      [AppointmentStatus.PENDING]: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
      [AppointmentStatus.CONFIRMED]: { bg: 'rgba(16,185,129,0.15)', text: '#10b981' },
      [AppointmentStatus.CANCELLED]: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
      [AppointmentStatus.DONE]: { bg: 'rgba(100,116,139,0.12)', text: '#64748b' },
    };
    return m[status];
  }

  getStatusColor(s: AppointmentStatus): string { return this.getEventColors(s).text; }
  getStatusBg(s: AppointmentStatus): string { return this.getEventColors(s).bg; }

  getStatusBadgeClass(s: AppointmentStatus): string {
    const m: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: 'badge-warning',
      [AppointmentStatus.CONFIRMED]: 'badge-success',
      [AppointmentStatus.CANCELLED]: 'badge-danger',
      [AppointmentStatus.DONE]: 'badge-secondary',
    };
    return m[s];
  }

  getStatusLabel(s: AppointmentStatus): string {
    const m: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: 'Pendente',
      [AppointmentStatus.CONFIRMED]: 'Confirmado',
      [AppointmentStatus.CANCELLED]: 'Cancelado',
      [AppointmentStatus.DONE]: 'Concluido',
    };
    return m[s];
  }

  private generateMockEvents(): ReadonlyArray<Appointment> {
    const today = new Date();
    const mk = (dayOff: number, hour: number, dur: number): { start: string; end: string } => {
      const d = new Date(today); d.setDate(d.getDate() + dayOff); d.setHours(hour, 0, 0, 0);
      return { start: d.toISOString(), end: new Date(d.getTime() + dur * 60000).toISOString() };
    };
    const apt = (id: string, title: string, lead: string, svc: string, t: { start: string; end: string }, st: AppointmentStatus): Appointment => ({
      id, leadId: 'l1', leadName: lead, agentId: null, tenantId: 't1', title, description: '', serviceType: svc,
      startTime: t.start, endTime: t.end, status: st, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    return [
      apt('m1', 'Troca de oleo', 'Carlos Silva', 'Troca de oleo', mk(0, 8, 60), AppointmentStatus.CONFIRMED),
      apt('m2', 'Revisao completa', 'Ana Santos', 'Revisao', mk(0, 10, 120), AppointmentStatus.PENDING),
      apt('m3', 'Alinhamento', 'Pedro Costa', 'Alinhamento', mk(0, 14, 60), AppointmentStatus.CONFIRMED),
      apt('m4', 'Diagnostico eletronico', 'Maria Lima', 'Diagnostico', mk(1, 9, 90), AppointmentStatus.PENDING),
      apt('m5', 'Troca de pastilhas', 'Joao Ferreira', 'Freios', mk(1, 13, 60), AppointmentStatus.CONFIRMED),
      apt('m6', 'Reparo AC', 'Lucas Oliveira', 'Ar condicionado', mk(2, 8, 120), AppointmentStatus.PENDING),
      apt('m7', 'Suspensao', 'Fernanda Rocha', 'Suspensao', mk(2, 11, 90), AppointmentStatus.DONE),
      apt('m8', 'Troca de correia', 'Roberto Alves', 'Motor', mk(-1, 9, 120), AppointmentStatus.DONE),
      apt('m9', 'Injecao eletronica', 'Camila Dias', 'Motor', mk(-1, 14, 60), AppointmentStatus.CANCELLED),
      apt('m10', 'Check-up geral', 'Marcos Souza', 'Revisao', mk(3, 10, 120), AppointmentStatus.CONFIRMED),
    ];
  }
}
