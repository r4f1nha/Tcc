import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadService } from '../../services/lead.service';
import { CreateLeadPayload, LeadPriority, LeadStatus } from '../../models/lead.model';

@Component({
  selector: 'app-lead-create-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .lead-create-wrapper {
      padding: 24px;
    }

    .lead-create-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
    }

    .lead-create-title {
      color: #111827;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }

    .lead-create-label {
      display: block;
      margin-bottom: 8px;
      color: #374151;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .lead-create-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .lead-create-btn-secondary {
      border: 1px solid #d1d5db;
      background: #ffffff;
      color: #374151;
      border-radius: 8px;
      padding: 8px 14px;
      font-weight: 500;
      cursor: pointer;
    }

    .lead-create-btn-primary {
      border: none;
      background: #4f46e5;
      color: #ffffff;
      border-radius: 8px;
      padding: 10px 18px;
      font-weight: 600;
      cursor: pointer;
    }

    .lead-create-btn-primary:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    .lead-create-input,
    .lead-create-select,
    .lead-create-textarea {
      width: 100%;
      border: 1px solid #d1d5db;
      border-radius: 10px;
      padding: 10px 12px;
      background: #ffffff;
      color: #111827;
      outline: none;
    }
  `],
  template: `
    <div class="lead-create-wrapper">
      <div class="card lead-create-card">
        <div class="card-body">
          <div class="lead-create-actions">
            <h4 class="lead-create-title">
              {{ isEditMode ? 'Editar Lead' : 'Novo Lead' }}
            </h4>

            <button
              type="button"
              class="lead-create-btn-secondary"
              (click)="goBack()"
            >
              Voltar
            </button>
          </div>

          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="lead-create-label">Nome</label>
                <input class="lead-create-input" formControlName="name" />
              </div>

              <div class="col-md-6 mb-3">
                <label class="lead-create-label">Empresa</label>
                <input class="lead-create-input" formControlName="company" />
              </div>

              <div class="col-md-6 mb-3">
                <label class="lead-create-label">Origem</label>
                <input class="lead-create-input" formControlName="origin" />
              </div>

              <div class="col-md-6 mb-3">
                <label class="lead-create-label">Email</label>
                <input class="lead-create-input" formControlName="email" />
              </div>

              <div class="col-md-6 mb-3">
                <label class="lead-create-label">Telefone</label>
                <input class="lead-create-input" formControlName="phone" />
              </div>

              <div class="col-md-6 mb-3">
                <label class="lead-create-label">Valor</label>
                <input type="number" class="lead-create-input" formControlName="value" />
              </div>

              <div class="col-md-6 mb-3">
                <label class="lead-create-label">Etapa</label>
                <select class="lead-create-select" formControlName="stage">
                  <option value="NOVO_LEAD">Novo lead</option>
                  <option value="QUALIFICACAO">Qualificação</option>
                  <option value="PROPOSTA">Proposta</option>
                  <option value="NEGOCIACAO">Negociação</option>
                  <option value="GANHO">Ganho</option>
                  <option value="PERDIDO">Perdido</option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <label class="lead-create-label">Prioridade</label>
                <select class="lead-create-select" formControlName="priority">
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>

              <div class="col-12 mb-3">
                <label class="lead-create-label">Próximo passo</label>
                <input class="lead-create-input" formControlName="nextStep" />
              </div>

              <div class="col-12 mb-3">
                <label class="lead-create-label">Observações</label>
                <textarea
                  class="lead-create-textarea"
                  rows="4"
                  formControlName="notes"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              class="lead-create-btn-primary"
              [disabled]="form.invalid || saving"
            >
              {{ saving ? 'Salvando...' : (isEditMode ? 'Atualizar Lead' : 'Salvar Lead') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class LeadCreatePageComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly leadService = inject(LeadService);

  saving = false;
  isEditMode = false;
  leadId: number | null = null;

  readonly form = this.fb.group({
    name: ['', Validators.required],
    company: [''],
    origin: [''],
    email: ['', Validators.email],
    phone: [''],
    value: [0],
    stage: ['NOVO_LEAD' as LeadStatus, Validators.required],
    priority: ['MEDIA' as LeadPriority, Validators.required],
    nextStep: [''],
    notes: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.leadId = Number(id);

      this.leadService.getById(this.leadId).subscribe({
        next: (lead) => {
          this.form.patchValue({
            name: lead.name,
            company: lead.company ?? '',
            origin: lead.origin ?? '',
            email: lead.email ?? '',
            phone: lead.phone ?? '',
            value: lead.value ?? 0,
            stage: lead.stage,
            priority: lead.priority,
            nextStep: lead.nextStep ?? '',
            notes: lead.notes ?? '',
          });
        },
        error: (err) => {
          console.error('Erro ao carregar lead para edição', err);
          this.router.navigate(['/leads']);
        },
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    const raw = this.form.getRawValue();

    const payload: CreateLeadPayload = {
      name: raw.name,
      company: raw.company || undefined,
      origin: raw.origin || undefined,
      email: raw.email || undefined,
      phone: raw.phone || undefined,
      value: raw.value || undefined,
      stage: raw.stage,
      priority: raw.priority,
      nextStep: raw.nextStep || undefined,
      notes: raw.notes || undefined,
    };

    const request$ = this.isEditMode && this.leadId
      ? this.leadService.update(this.leadId, payload)
      : this.leadService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/leads']);
      },
      error: (err) => {
        console.error('Erro ao salvar lead', err);
        this.saving = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/leads']);
  }
}