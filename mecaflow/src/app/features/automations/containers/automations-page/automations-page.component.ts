import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutomationService } from '../../services/automation.service';
import {
  ACTION_TYPE_LABELS,
  Automation,
  AutomationActionItem,
  AutomationActionType,
  AutomationCondition,
  AutomationEvent,
  CONDITION_ATTRIBUTE_LABELS,
  CONDITION_OPERATOR_LABELS,
  ConditionAttribute,
  ConditionOperator,
  EVENT_LABELS,
} from '../../models/automation.model';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { LabelService } from '../../../labels/services/label.service';
import { Label } from '../../../labels/models/label.model';

interface AutomationForm {
  name: string;
  description: string;
  event: AutomationEvent;
  conditionMatch: 'ALL' | 'ANY';
  conditions: AutomationCondition[];
  actions: AutomationActionItem[];
}

@Component({
  selector: 'app-automations-page',
  standalone: true,
  imports: [DatePipe, FormsModule, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Cabeçalho -->
    <div class="row mb-1">
      <div class="col-12">
        <div class="content-header d-flex align-items-center justify-content-between">
          <div>
            <i class="fas fa-bolt header-icon"></i>&nbsp;Automações
          </div>
          <button class="btn btn-primary btn-sm" (click)="openCreate()">
            <i class="fas fa-plus mr-1"></i>Nova Automação
          </button>
        </div>
      </div>
    </div>

    @if (loading()) {
      @for (i of [1,2,3]; track i) {
        <div class="mb-3"><app-skeleton variant="card" /></div>
      }
    } @else if (automations().length === 0) {
      <div class="card">
        <div class="card-body text-center py-5 text-muted">
          <i class="fas fa-bolt fa-2x mb-3 d-block text-light"></i>
          Nenhuma automação configurada.<br>
          <small>Crie automações para executar ações com base em palavras ou frases nas conversas.</small>
        </div>
      </div>
    } @else {
      @for (automation of automations(); track automation.id) {
        <div class="card mb-3 automation-card">
          <div class="card-body py-3">
            <!-- Header da automação -->
            <div class="d-flex align-items-start justify-content-between mb-2">
              <div>
                <h6 class="mb-0 font-weight-600">{{ automation.name }}</h6>
                @if (automation.description) {
                  <small class="text-muted">{{ automation.description }}</small>
                }
              </div>
              <div class="d-flex align-items-center ml-3">
                <small class="text-muted mr-3">{{ automation.updatedAt | date:'dd/MM/yyyy' }}</small>
                <div class="custom-control custom-switch mr-2">
                  <input type="checkbox" class="custom-control-input"
                    [id]="'toggle-' + automation.id"
                    [checked]="automation.active"
                    (change)="onToggle(automation)">
                  <label class="custom-control-label" [for]="'toggle-' + automation.id"></label>
                </div>
                <button class="btn btn-link btn-sm text-primary p-0 mr-1" (click)="openEdit(automation)" title="Editar">
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="btn btn-link btn-sm text-muted p-0 mr-1" (click)="onCopy(automation)" title="Duplicar">
                  <i class="fas fa-copy"></i>
                </button>
                <button class="btn btn-link btn-sm text-danger p-0" (click)="confirmDelete(automation)" title="Excluir">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>

            <hr class="my-2">

            <div class="row" style="font-size:0.82rem;">
              <!-- Evento -->
              <div class="col-md-3 mb-2">
                <small class="text-muted text-uppercase font-weight-600 d-block mb-1" style="font-size:0.7rem;letter-spacing:0.5px;">Evento</small>
                <span class="badge badge-pill badge-light border">
                  <i class="fas fa-play-circle mr-1 text-primary"></i>
                  {{ getEventLabel(automation.event) }}
                </span>
              </div>

              <!-- Condições -->
              <div class="col-md-5 mb-2">
                <small class="text-muted text-uppercase font-weight-600 d-block mb-1" style="font-size:0.7rem;letter-spacing:0.5px;">
                  Condições
                  <span class="badge badge-pill badge-secondary ml-1" style="font-size:0.65rem;">{{ automation.conditionMatch === 'ALL' ? 'TODAS' : 'QUALQUER' }}</span>
                </small>
                <div>
                  @for (cond of automation.conditions; track $index) {
                    <div class="d-flex align-items-center mb-1">
                      <i class="fas fa-filter mr-1 text-muted" style="font-size:0.7rem;"></i>
                      <span>
                        <span class="font-weight-600">{{ getAttributeLabel(cond.attribute) }}</span>
                        <span class="text-muted mx-1">{{ getOperatorLabel(cond.operator) }}</span>
                        <span class="badge badge-light border">"{{ cond.value }}"</span>
                      </span>
                    </div>
                  }
                  @if (automation.conditions.length === 0) {
                    <span class="text-muted">Sem condições (sempre executar)</span>
                  }
                </div>
              </div>

              <!-- Ações -->
              <div class="col-md-4 mb-2">
                <small class="text-muted text-uppercase font-weight-600 d-block mb-1" style="font-size:0.7rem;letter-spacing:0.5px;">Ações</small>
                <div>
                  @for (action of automation.actions; track $index) {
                    <div class="d-flex align-items-center mb-1">
                      <i class="fas fa-arrow-right mr-1 text-primary" style="font-size:0.7rem;"></i>
                      <span class="font-weight-600">{{ getActionLabel(action.actionType) }}</span>
                      @if (action.value) {
                        <span class="ml-1">
                          @if (isLabelAction(action.actionType)) {
                            <span class="badge badge-pill"
                              [style.background-color]="getLabelColor(action.value) + '20'"
                              [style.color]="getLabelColor(action.value)"
                              [style.border]="'1px solid ' + getLabelColor(action.value) + '50'">
                              {{ action.value }}
                            </span>
                          } @else {
                            <span class="badge badge-light border">{{ action.value }}</span>
                          }
                        </span>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    }

    <!-- Modal Criar/Editar Automação -->
    @if (showModal()) {
      <div class="modal-backdrop-custom" (click)="closeModal()"></div>
      <div class="modal d-block" style="z-index:1050;" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-bolt mr-2 text-primary"></i>
                {{ editingId() ? 'Editar Automação' : 'Nova Automação' }}
              </h5>
              <button type="button" class="close" (click)="closeModal()">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">

              <!-- Nome -->
              <div class="form-group">
                <label class="font-weight-600" style="font-size:0.85rem;">
                  Nome <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control form-control-sm"
                  [value]="form().name"
                  (input)="updateForm('name', $any($event.target).value)"
                  placeholder="ex: Etiqueta urgente para mensagens de emergência" />
              </div>

              <!-- Descrição -->
              <div class="form-group">
                <label class="font-weight-600" style="font-size:0.85rem;">Descrição</label>
                <input type="text" class="form-control form-control-sm"
                  [value]="form().description"
                  (input)="updateForm('description', $any($event.target).value)"
                  placeholder="Descreva o objetivo desta automação..." />
              </div>

              <!-- Evento -->
              <div class="form-group">
                <label class="font-weight-600" style="font-size:0.85rem;">
                  Evento <span class="text-danger">*</span>
                </label>
                <select class="form-control form-control-sm"
                  [value]="form().event"
                  (change)="updateForm('event', $any($event.target).value)">
                  @for (ev of allEvents; track ev.value) {
                    <option [value]="ev.value">{{ ev.label }}</option>
                  }
                </select>
                <small class="text-muted">Quando este evento ocorrer, as condições serão verificadas.</small>
              </div>

              <hr>

              <!-- Condições -->
              <div class="mb-3">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <label class="font-weight-600 mb-0" style="font-size:0.85rem;">Condições</label>
                  <div class="d-flex align-items-center">
                    <small class="text-muted mr-2">Executar quando</small>
                    <select class="form-control form-control-sm" style="width:auto;"
                      [value]="form().conditionMatch"
                      (change)="updateForm('conditionMatch', $any($event.target).value)">
                      <option value="ALL">TODAS</option>
                      <option value="ANY">QUALQUER</option>
                    </select>
                    <small class="text-muted ml-2">condição for atendida</small>
                  </div>
                </div>

                @for (cond of form().conditions; track $index; let i = $index) {
                  <div class="d-flex align-items-center mb-2" style="gap:6px;">
                    <select class="form-control form-control-sm" style="flex:1.4;"
                      [value]="cond.attribute"
                      (change)="updateCondition(i, 'attribute', $any($event.target).value)">
                      @for (attr of allAttributes; track attr.value) {
                        <option [value]="attr.value">{{ attr.label }}</option>
                      }
                    </select>
                    <select class="form-control form-control-sm" style="flex:1;"
                      [value]="cond.operator"
                      (change)="updateCondition(i, 'operator', $any($event.target).value)">
                      @for (op of allOperators; track op.value) {
                        <option [value]="op.value">{{ op.label }}</option>
                      }
                    </select>
                    <input type="text" class="form-control form-control-sm" style="flex:1.5;"
                      [value]="cond.value"
                      (input)="updateCondition(i, 'value', $any($event.target).value)"
                      placeholder="valor..." />
                    <button type="button" class="btn btn-outline-danger btn-sm px-2" (click)="removeCondition(i)">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                }

                <button type="button" class="btn btn-outline-secondary btn-sm mt-1" (click)="addCondition()">
                  <i class="fas fa-plus mr-1"></i>Adicionar condição
                </button>

                @if (form().conditions.length === 0) {
                  <small class="text-muted d-block mt-1">Sem condições: a automação será executada para todo evento.</small>
                }
              </div>

              <hr>

              <!-- Ações -->
              <div class="mb-1">
                <label class="font-weight-600 d-block mb-2" style="font-size:0.85rem;">
                  Ações <span class="text-danger">*</span>
                </label>

                @for (action of form().actions; track $index; let i = $index) {
                  <div class="d-flex align-items-center mb-2" style="gap:6px;">
                    <select class="form-control form-control-sm" style="flex:1.2;"
                      [value]="action.actionType"
                      (change)="updateAction(i, 'actionType', $any($event.target).value)">
                      @for (act of allActionTypes; track act.value) {
                        <option [value]="act.value">{{ act.label }}</option>
                      }
                    </select>

                    @if (isLabelAction(action.actionType)) {
                      <select class="form-control form-control-sm" style="flex:1.3;"
                        [value]="action.value"
                        (change)="updateAction(i, 'value', $any($event.target).value)">
                        <option value="">Selecione uma etiqueta...</option>
                        @for (label of labels(); track label.id) {
                          <option [value]="label.name">{{ label.name }}</option>
                        }
                      </select>
                    } @else {
                      <input type="text" class="form-control form-control-sm" style="flex:1.3;"
                        [value]="action.value"
                        (input)="updateAction(i, 'value', $any($event.target).value)"
                        [placeholder]="getActionPlaceholder(action.actionType)" />
                    }

                    <button type="button" class="btn btn-outline-danger btn-sm px-2" (click)="removeAction(i)">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                }

                <button type="button" class="btn btn-outline-secondary btn-sm mt-1" (click)="addAction()">
                  <i class="fas fa-plus mr-1"></i>Adicionar ação
                </button>
              </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary btn-sm" (click)="closeModal()">
                Cancelar
              </button>
              <button type="button" class="btn btn-primary btn-sm"
                [disabled]="!isFormValid() || saving()"
                (click)="save()">
                @if (saving()) {
                  <span class="spinner-border spinner-border-sm mr-1" role="status"></span>
                }
                {{ editingId() ? 'Salvar alterações' : 'Criar automação' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Modal Confirmar Exclusão -->
    @if (deleteTarget()) {
      <div class="modal-backdrop-custom" (click)="deleteTarget.set(null)"></div>
      <div class="modal d-block" style="z-index:1050;" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-sm">
          <div class="modal-content">
            <div class="modal-header border-0 pb-0">
              <h6 class="modal-title text-danger">
                <i class="fas fa-exclamation-triangle mr-2"></i>Excluir automação
              </h6>
            </div>
            <div class="modal-body pt-2">
              <p class="mb-0" style="font-size:0.9rem;">
                Tem certeza que deseja excluir <strong>{{ deleteTarget()!.name }}</strong>?
              </p>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-outline-secondary btn-sm" (click)="deleteTarget.set(null)">Cancelar</button>
              <button type="button" class="btn btn-danger btn-sm" [disabled]="saving()" (click)="deleteAutomation()">
                @if (saving()) {
                  <span class="spinner-border spinner-border-sm mr-1" role="status"></span>
                }
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class AutomationsPageComponent implements OnInit {
  private readonly automationService = inject(AutomationService);
  private readonly labelService = inject(LabelService);

  readonly automations = signal<ReadonlyArray<Automation>>([]);
  readonly labels = signal<ReadonlyArray<Label>>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly showModal = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly deleteTarget = signal<Automation | null>(null);

  // Opções para selects
  readonly allEvents = Object.values(AutomationEvent).map((v) => ({
    value: v,
    label: EVENT_LABELS[v],
  }));
  readonly allAttributes = Object.values(ConditionAttribute).map((v) => ({
    value: v,
    label: CONDITION_ATTRIBUTE_LABELS[v],
  }));
  readonly allOperators = Object.values(ConditionOperator).map((v) => ({
    value: v,
    label: CONDITION_OPERATOR_LABELS[v],
  }));
  readonly allActionTypes = Object.values(AutomationActionType).map((v) => ({
    value: v,
    label: ACTION_TYPE_LABELS[v],
  }));

  private readonly defaultForm: AutomationForm = {
    name: '',
    description: '',
    event: AutomationEvent.MESSAGE_RECEIVED,
    conditionMatch: 'ALL',
    conditions: [],
    actions: [],
  };

  readonly form = signal<AutomationForm>({ ...this.defaultForm, conditions: [], actions: [] });

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.automationService.getAll().subscribe({
      next: (data) => { this.automations.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
    this.labelService.getAll().subscribe({
      next: (data) => this.labels.set(data),
      error: () => {},
    });
  }

  // Modal helpers
  openCreate(): void {
    this.editingId.set(null);
    this.form.set({ ...this.defaultForm, conditions: [], actions: [] });
    this.showModal.set(true);
  }

  openEdit(automation: Automation): void {
    this.editingId.set(automation.id);
    this.form.set({
      name: automation.name,
      description: automation.description,
      event: automation.event,
      conditionMatch: automation.conditionMatch,
      conditions: automation.conditions.map((c) => ({ ...c })),
      actions: automation.actions.map((a) => ({ ...a })),
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingId.set(null);
  }

  updateForm<K extends keyof AutomationForm>(key: K, value: AutomationForm[K]): void {
    this.form.update((f) => ({ ...f, [key]: value }));
  }

  // Conditions
  addCondition(): void {
    this.form.update((f) => ({
      ...f,
      conditions: [
        ...f.conditions,
        { attribute: ConditionAttribute.MESSAGE_CONTENT, operator: ConditionOperator.CONTAINS, value: '' },
      ],
    }));
  }

  removeCondition(index: number): void {
    this.form.update((f) => ({
      ...f,
      conditions: f.conditions.filter((_, i) => i !== index),
    }));
  }

  updateCondition(index: number, key: keyof AutomationCondition, value: string): void {
    this.form.update((f) => ({
      ...f,
      conditions: f.conditions.map((c, i) =>
        i === index ? { ...c, [key]: value } : c,
      ),
    }));
  }

  // Actions
  addAction(): void {
    this.form.update((f) => ({
      ...f,
      actions: [
        ...f.actions,
        { actionType: AutomationActionType.ADD_LABEL, value: '' },
      ],
    }));
  }

  removeAction(index: number): void {
    this.form.update((f) => ({
      ...f,
      actions: f.actions.filter((_, i) => i !== index),
    }));
  }

  updateAction(index: number, key: keyof AutomationActionItem, value: string): void {
    this.form.update((f) => ({
      ...f,
      actions: f.actions.map((a, i) =>
        i === index ? { ...a, [key]: value } : a,
      ),
    }));
  }

  isFormValid(): boolean {
    const f = this.form();
    return f.name.trim().length > 0 && f.actions.length > 0;
  }

  save(): void {
    if (!this.isFormValid()) return;
    const f = this.form();
    const payload: Partial<Automation> = {
      name: f.name.trim(),
      description: f.description.trim(),
      event: f.event,
      conditionMatch: f.conditionMatch,
      conditions: f.conditions,
      actions: f.actions,
    };

    this.saving.set(true);
    const id = this.editingId();
    const request$ = id
      ? this.automationService.update(id, payload)
      : this.automationService.create(payload);

    request$.subscribe({
      next: (saved) => {
        if (id) {
          this.automations.update((list) => list.map((a) => (a.id === id ? saved : a)));
        } else {
          this.automations.update((list) => [...list, saved]);
        }
        this.saving.set(false);
        this.closeModal();
      },
      error: () => this.saving.set(false),
    });
  }

  onToggle(automation: Automation): void {
    this.automationService.toggleActive(automation.id, !automation.active).subscribe((updated) => {
      this.automations.update((list) => list.map((a) => (a.id === updated.id ? updated : a)));
    });
  }

  onCopy(automation: Automation): void {
    const payload: Partial<Automation> = {
      name: `${automation.name} (cópia)`,
      description: automation.description,
      event: automation.event,
      conditionMatch: automation.conditionMatch,
      conditions: [...automation.conditions],
      actions: [...automation.actions],
    };
    this.automationService.create(payload).subscribe((saved) => {
      this.automations.update((list) => [...list, saved]);
    });
  }

  confirmDelete(automation: Automation): void {
    this.deleteTarget.set(automation);
  }

  deleteAutomation(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.saving.set(true);
    this.automationService.delete(target.id).subscribe({
      next: () => {
        this.automations.update((list) => list.filter((a) => a.id !== target.id));
        this.saving.set(false);
        this.deleteTarget.set(null);
      },
      error: () => this.saving.set(false),
    });
  }

  // Display helpers
  getEventLabel(event: AutomationEvent): string {
    return EVENT_LABELS[event] ?? event;
  }

  getAttributeLabel(attr: ConditionAttribute): string {
    return CONDITION_ATTRIBUTE_LABELS[attr] ?? attr;
  }

  getOperatorLabel(op: ConditionOperator): string {
    return CONDITION_OPERATOR_LABELS[op] ?? op;
  }

  getActionLabel(actionType: AutomationActionType): string {
    return ACTION_TYPE_LABELS[actionType] ?? actionType;
  }

  isLabelAction(actionType: AutomationActionType): boolean {
    return actionType === AutomationActionType.ADD_LABEL || actionType === AutomationActionType.REMOVE_LABEL;
  }

  getLabelColor(labelName: string): string {
    return this.labels().find((l) => l.name === labelName)?.color ?? '#6c757d';
  }

  getActionPlaceholder(actionType: AutomationActionType): string {
    switch (actionType) {
      case AutomationActionType.ASSIGN_AGENT: return 'ID ou nome do agente...';
      case AutomationActionType.SEND_MESSAGE: return 'Texto da mensagem...';
      case AutomationActionType.CHANGE_STATUS: return 'open, resolved, pending...';
      default: return 'valor...';
    }
  }
}
