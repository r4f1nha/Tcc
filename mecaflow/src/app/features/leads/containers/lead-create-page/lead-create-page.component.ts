import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeadService } from '../../services/lead.service';

@Component({
  selector: 'app-lead-create-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <h4 class="mb-0">Novo Lead</h4>
          <button type="button" class="btn btn-outline-secondary btn-sm" (click)="goBack()">
            Voltar
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label>Nome</label>
              <input class="form-control" formControlName="name" />
            </div>

            <div class="col-md-6 mb-3">
              <label>Empresa</label>
              <input class="form-control" formControlName="company" />
            </div>

            <div class="col-md-6 mb-3">
              <label>Origem</label>
              <input class="form-control" formControlName="origin" />
            </div>

            <div class="col-md-6 mb-3">
              <label>Email</label>
              <input class="form-control" formControlName="email" />
            </div>

            <div class="col-md-6 mb-3">
              <label>Telefone</label>
              <input class="form-control" formControlName="phone" />
            </div>

            <div class="col-md-6 mb-3">
              <label>Valor</label>
              <input type="number" class="form-control" formControlName="value" />
            </div>

            <div class="col-md-6 mb-3">
              <label>Etapa</label>
              <select class="form-control" formControlName="stage">
                <option value="NOVO_LEAD">Novo lead</option>
                <option value="QUALIFICACAO">Qualificação</option>
                <option value="PROPOSTA">Proposta</option>
                <option value="NEGOCIACAO">Negociação</option>
                <option value="GANHO">Ganho</option>
                <option value="PERDIDO">Perdido</option>
              </select>
            </div>

            <div class="col-md-6 mb-3">
              <label>Prioridade</label>
              <select class="form-control" formControlName="priority">
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>

            <div class="col-12 mb-3">
              <label>Próximo passo</label>
              <input class="form-control" formControlName="nextStep" />
            </div>

            <div class="col-12 mb-3">
              <label>Observações</label>
              <textarea class="form-control" rows="4" formControlName="notes"></textarea>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">
            {{ saving ? 'Salvando...' : 'Salvar Lead' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class LeadCreatePageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly leadService = inject(LeadService);

  saving = false;

  readonly form = this.fb.group({
    name: ['', Validators.required],
    company: [''],
    origin: [''],
    email: [''],
    phone: [''],
    value: [null as number | null],
    stage: ['NOVO_LEAD', Validators.required],
    priority: ['MEDIA', Validators.required],
    nextStep: [''],
    notes: [''],
  });

  save(): void {
    if (this.form.invalid) return;

    this.saving = true;

    this.leadService.create(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/leads']);
      },
      error: (err) => {
        console.error('Erro ao criar lead', err);
        this.saving = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/leads']);
  }
}