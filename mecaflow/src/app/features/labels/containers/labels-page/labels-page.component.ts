import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabelService } from '../../services/label.service';
import { CreateLabelDto, Label, LABEL_PRESET_COLORS } from '../../models/label.model';

interface LabelForm {
  name: string;
  color: string;
  description: string;
  showOnSidebar: boolean;
}

@Component({
  selector: 'app-labels-page',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Cabeçalho -->
    <div class="row mb-1">
      <div class="col-12">
        <div class="content-header d-flex align-items-center justify-content-between">
          <div>
            <i class="fas fa-tags header-icon"></i>&nbsp;Etiquetas
          </div>
          <button class="btn btn-primary btn-sm" (click)="openCreate()">
            <i class="fas fa-plus mr-1"></i>Nova Etiqueta
          </button>
        </div>
      </div>
    </div>

    <!-- Tabela de Etiquetas -->
    <div class="card">
      <div class="card-body p-0">
        @if (loading()) {
          <div class="text-center py-5">
            <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
          </div>
        } @else {
          <div class="table-responsive">
            <table class="table table-hover table-sm mb-0">
              <thead class="thead-light">
                <tr>
                  <th style="width:220px;">Nome</th>
                  <th>Descrição</th>
                  <th class="text-center" style="width:110px;">Conversas</th>
                  <th class="text-center" style="width:80px;">Sidebar</th>
                  <th style="width:90px;"></th>
                </tr>
              </thead>
              <tbody>
                @for (label of labels(); track label.id) {
                  <tr>
                    <td>
                      <span class="badge badge-pill d-inline-flex align-items-center"
                        style="font-size:0.8rem;padding:4px 10px;"
                        [style.background-color]="label.color + '20'"
                        [style.color]="label.color"
                        [style.border]="'1px solid ' + label.color + '50'">
                        <span class="rounded-circle mr-2" style="width:8px;height:8px;display:inline-block;"
                          [style.background-color]="label.color"></span>
                        {{ label.name }}
                      </span>
                    </td>
                    <td class="text-muted align-middle" style="font-size:0.85rem;">
                      {{ label.description || '—' }}
                    </td>
                    <td class="text-center align-middle">
                      <span class="badge badge-secondary badge-pill">{{ label.conversationCount }}</span>
                    </td>
                    <td class="text-center align-middle">
                      @if (label.showOnSidebar) {
                        <i class="fas fa-check text-success"></i>
                      } @else {
                        <i class="fas fa-minus text-muted"></i>
                      }
                    </td>
                    <td class="text-right align-middle">
                      <button class="btn btn-link btn-sm text-primary p-0 mr-2" (click)="openEdit(label)" title="Editar">
                        <i class="fas fa-pencil-alt"></i>
                      </button>
                      <button class="btn btn-link btn-sm text-danger p-0" (click)="confirmDelete(label)" title="Excluir">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="text-center text-muted py-5">
                      <i class="fas fa-tags fa-2x mb-2 d-block text-light"></i>
                      Nenhuma etiqueta criada ainda.<br>
                      <small>Crie etiquetas para organizar suas conversas.</small>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>

    <!-- Modal Criar/Editar -->
    @if (showModal()) {
      <div class="modal-backdrop-custom" (click)="closeModal()"></div>
      <div class="modal d-block" style="z-index:1050;" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-tag mr-2 text-primary"></i>
                {{ editingId() ? 'Editar Etiqueta' : 'Nova Etiqueta' }}
              </h5>
              <button type="button" class="close" (click)="closeModal()">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="font-weight-600" style="font-size:0.85rem;">
                  Nome <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control form-control-sm"
                  [(ngModel)]="form().name"
                  (ngModelChange)="updateForm('name', $event)"
                  placeholder="ex: urgente, suporte, vendas..."
                  maxlength="50" />
                <small class="text-muted">Letras minúsculas, sem espaços. Use hífen se necessário.</small>
              </div>

              <div class="form-group">
                <label class="font-weight-600" style="font-size:0.85rem;">Descrição</label>
                <input type="text" class="form-control form-control-sm"
                  [(ngModel)]="form().description"
                  (ngModelChange)="updateForm('description', $event)"
                  placeholder="Descreva para que serve esta etiqueta..."
                  maxlength="200" />
              </div>

              <div class="form-group">
                <label class="font-weight-600" style="font-size:0.85rem;">Cor</label>
                <div class="d-flex flex-wrap" style="gap:8px;">
                  @for (color of presetColors; track color) {
                    <button type="button"
                      class="rounded-circle border-0 p-0 position-relative"
                      style="width:28px;height:28px;cursor:pointer;transition:transform 0.15s;"
                      [style.background-color]="color"
                      [style.transform]="form().color === color ? 'scale(1.25)' : 'scale(1)'"
                      [style.box-shadow]="form().color === color ? '0 0 0 3px ' + color + '50' : 'none'"
                      (click)="updateForm('color', color)"
                      [title]="color">
                      @if (form().color === color) {
                        <i class="fas fa-check" style="color:#fff;font-size:11px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"></i>
                      }
                    </button>
                  }
                  <!-- Custom color input -->
                  <input type="color" class="rounded border-0"
                    style="width:28px;height:28px;padding:1px;cursor:pointer;"
                    [value]="form().color"
                    (input)="updateForm('color', $any($event.target).value)"
                    title="Cor personalizada" />
                </div>
                <div class="mt-2 d-flex align-items-center">
                  <span class="badge badge-pill mr-2"
                    style="font-size:0.8rem;padding:4px 10px;"
                    [style.background-color]="form().color + '20'"
                    [style.color]="form().color"
                    [style.border]="'1px solid ' + form().color + '50'">
                    <span class="rounded-circle mr-1" style="width:8px;height:8px;display:inline-block;"
                      [style.background-color]="form().color"></span>
                    {{ form().name || 'prévia' }}
                  </span>
                  <small class="text-muted">prévia da etiqueta</small>
                </div>
              </div>

              <div class="form-group mb-0">
                <div class="custom-control custom-switch">
                  <input type="checkbox" class="custom-control-input" id="showOnSidebarSwitch"
                    [checked]="form().showOnSidebar"
                    (change)="updateForm('showOnSidebar', $any($event.target).checked)" />
                  <label class="custom-control-label" for="showOnSidebarSwitch"
                    style="font-size:0.85rem;font-weight:600;">
                    Mostrar na sidebar
                  </label>
                </div>
                <small class="text-muted d-block mt-1">Exibe a etiqueta no menu lateral para acesso rápido.</small>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary btn-sm" (click)="closeModal()">
                Cancelar
              </button>
              <button type="button" class="btn btn-primary btn-sm"
                [disabled]="!form().name.trim() || saving()"
                (click)="save()">
                @if (saving()) {
                  <span class="spinner-border spinner-border-sm mr-1" role="status"></span>
                }
                {{ editingId() ? 'Salvar alterações' : 'Criar etiqueta' }}
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
                <i class="fas fa-exclamation-triangle mr-2"></i>Excluir etiqueta
              </h6>
            </div>
            <div class="modal-body pt-2">
              <p class="mb-0" style="font-size:0.9rem;">
                Tem certeza que deseja excluir a etiqueta
                <strong [style.color]="deleteTarget()!.color">{{ deleteTarget()!.name }}</strong>?
                Esta ação não pode ser desfeita.
              </p>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-outline-secondary btn-sm" (click)="deleteTarget.set(null)">
                Cancelar
              </button>
              <button type="button" class="btn btn-danger btn-sm" [disabled]="saving()" (click)="deleteLabel()">
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
export class LabelsPageComponent implements OnInit {
  private readonly labelService = inject(LabelService);

  readonly labels = signal<ReadonlyArray<Label>>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly showModal = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly deleteTarget = signal<Label | null>(null);

  readonly presetColors = LABEL_PRESET_COLORS;

  private readonly defaultForm: LabelForm = {
    name: '',
    color: '#1F93FF',
    description: '',
    showOnSidebar: false,
  };

  readonly form = signal<LabelForm>({ ...this.defaultForm });

  ngOnInit(): void {
    this.loadLabels();
  }

  private loadLabels(): void {
    this.loading.set(true);
    this.labelService.getAll().subscribe({
      next: (data) => { this.labels.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.set({ ...this.defaultForm });
    this.showModal.set(true);
  }

  openEdit(label: Label): void {
    this.editingId.set(label.id);
    this.form.set({
      name: label.name,
      color: label.color,
      description: label.description,
      showOnSidebar: label.showOnSidebar,
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingId.set(null);
  }

  updateForm<K extends keyof LabelForm>(key: K, value: LabelForm[K]): void {
    this.form.update((f) => ({ ...f, [key]: value }));
  }

  save(): void {
    const f = this.form();
    if (!f.name.trim()) return;

    const dto: CreateLabelDto = {
      name: f.name.trim().toLowerCase().replace(/\s+/g, '-'),
      color: f.color,
      description: f.description.trim(),
      showOnSidebar: f.showOnSidebar,
    };

    this.saving.set(true);
    const id = this.editingId();
    const request$ = id
      ? this.labelService.update(id, dto)
      : this.labelService.create(dto);

    request$.subscribe({
      next: (saved) => {
        if (id) {
          this.labels.update((list) => list.map((l) => (l.id === id ? saved : l)));
        } else {
          this.labels.update((list) => [...list, saved]);
        }
        this.saving.set(false);
        this.closeModal();
      },
      error: () => this.saving.set(false),
    });
  }

  confirmDelete(label: Label): void {
    this.deleteTarget.set(label);
  }

  deleteLabel(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.saving.set(true);
    this.labelService.delete(target.id).subscribe({
      next: () => {
        this.labels.update((list) => list.filter((l) => l.id !== target.id));
        this.saving.set(false);
        this.deleteTarget.set(null);
      },
      error: () => this.saving.set(false),
    });
  }
}
