import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MetricPeriod, KpiCard, ActivityItem } from '../../models/dashboard.model';
import { MetricsGridComponent } from '../../components/metrics-grid/metrics-grid.component';
import { PeriodSelectorComponent } from '../../components/period-selector/period-selector.component';
import { RecentActivityComponent } from '../../components/recent-activity/recent-activity.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [MetricsGridComponent, PeriodSelectorComponent, RecentActivityComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Cabecalho da pagina -->
    <div class="row mb-1">
      <div class="col-12">
        <div class="content-header d-flex align-items-center justify-content-between">
          <div>
            <i class="fas fa-tachometer-alt header-icon"></i>&nbsp;Dashboard
          </div>
          <app-period-selector
            [selected]="selectedPeriod()"
            (periodChanged)="onPeriodChanged($event)"
          />
        </div>
      </div>
    </div>

    <!-- Indicadores principais -->
    <div class="row mb-3">
      <div class="col-md-3 col-sm-6 col-12 mb-3">
        <div class="indicator-card">
          <div class="indicator-icon" style="background:linear-gradient(135deg,#4F6EF7,#7b5ea7);">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="indicator-content">
            <h3>R$ 48,5K</h3>
            <p>Faturamento do Mes</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6 col-12 mb-3">
        <div class="indicator-card">
          <div class="indicator-icon" style="background:linear-gradient(135deg,#28C76F,#20a75a);">
            <i class="fas fa-comments"></i>
          </div>
          <div class="indicator-content">
            <h3>127</h3>
            <p>Conversas com IA</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6 col-12 mb-3">
        <div class="indicator-card">
          <div class="indicator-icon" style="background:linear-gradient(135deg,#FF9F43,#e08a30);">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="indicator-content">
            <h3>34</h3>
            <p>Agendamentos</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6 col-12 mb-3">
        <div class="indicator-card">
          <div class="indicator-icon" style="background:linear-gradient(135deg,#00CFE8,#00a8c1);">
            <i class="fas fa-users"></i>
          </div>
          <div class="indicator-content">
            <h3>68%</h3>
            <p>Taxa de Conversao</p>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="card mb-3">
      <div class="card-header">
        <h6 class="card-title">
          <i class="fas fa-chart-bar"></i> Metricas de Desempenho
        </h6>
      </div>
      <div class="card-body">
        <app-metrics-grid [kpis]="mockKpis" [loading]="false" />
      </div>
    </div>

    <!-- Atividades Recentes + Acoes Rapidas -->
    <div class="row">
      <div class="col-lg-6 mb-3">
        <app-recent-activity [activities]="mockActivities" />
      </div>
      <div class="col-lg-6 mb-3">
        <div class="card h-100">
          <div class="card-header">
            <h6 class="card-title">
              <i class="fas fa-bolt"></i> Acoes Rapidas
            </h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-6 mb-3">
                <button class="btn btn-outline-primary btn-block d-flex flex-column align-items-center py-3" style="height:90px;">
                  <i class="fas fa-user-plus mb-2" style="font-size:1.4rem;"></i>
                  <span style="font-size:0.8rem;">Novo Lead</span>
                </button>
              </div>
              <div class="col-6 mb-3">
                <button class="btn btn-outline-success btn-block d-flex flex-column align-items-center py-3" style="height:90px;">
                  <i class="fas fa-calendar-plus mb-2" style="font-size:1.4rem;"></i>
                  <span style="font-size:0.8rem;">Agendar</span>
                </button>
              </div>
              <div class="col-6 mb-3">
                <button class="btn btn-outline-warning btn-block d-flex flex-column align-items-center py-3" style="height:90px;">
                  <i class="fas fa-comments mb-2" style="font-size:1.4rem;"></i>
                  <span style="font-size:0.8rem;">Conversas</span>
                </button>
              </div>
              <div class="col-6 mb-3">
                <button class="btn btn-outline-info btn-block d-flex flex-column align-items-center py-3" style="height:90px;">
                  <i class="fas fa-file-export mb-2" style="font-size:1.4rem;"></i>
                  <span style="font-size:0.8rem;">Relatorios</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardPageComponent {
  readonly selectedPeriod = signal(MetricPeriod.MONTH);

  readonly mockKpis: ReadonlyArray<KpiCard> = [
    { id: '1', label: 'Ordens de Servico', value: 54, formattedValue: '54', trend: 'up', percentageChange: 12, icon: '' },
    { id: '2', label: 'Clientes Ativos', value: 186, formattedValue: '186', trend: 'up', percentageChange: 8, icon: '' },
    { id: '3', label: 'Satisfacao', value: 96, formattedValue: '96%', trend: 'up', percentageChange: 2, icon: '' },
    { id: '4', label: 'Tempo Medio (dias)', value: 3, formattedValue: '3.2', trend: 'down', percentageChange: 15, icon: '' },
    { id: '5', label: 'Pendentes', value: 8, formattedValue: '8', trend: 'neutral', percentageChange: 0, icon: '' },
    { id: '6', label: 'Concluidas Hoje', value: 5, formattedValue: '5', trend: 'up', percentageChange: 25, icon: '' },
  ];

  readonly mockActivities: ReadonlyArray<ActivityItem> = [
    { id: '1', type: 'order_created', title: 'Nova OS #1247 criada', description: 'Troca de oleo - Honda Civic 2022', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), actorName: 'IA Bot' },
    { id: '2', type: 'client_added', title: 'Novo lead capturado', description: 'Carlos Silva via WhatsApp', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), actorName: 'IA Bot' },
    { id: '3', type: 'order_completed', title: 'OS #1243 finalizada', description: 'Revisao completa - Toyota Corolla', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), actorName: 'Mecanico Joao' },
    { id: '4', type: 'payment_received', title: 'Pagamento recebido', description: 'R$ 1.250,00 - PIX', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), actorName: 'Sistema' },
    { id: '5', type: 'status_changed', title: 'OS #1245 em andamento', description: 'Diagnostico eletronico - VW Golf', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), actorName: 'Mecanico Pedro' },
  ];

  onPeriodChanged(period: MetricPeriod): void {
    this.selectedPeriod.set(period);
  }
}
