import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ServiceOrderService } from '../../services/service-order.service';
import {
  ServiceOrderPriority,
  ServiceOrderStatus,
} from '../../models/service-order';

@Component({
  selector: 'app-service-order-create-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="service-order-page">
      <div class="card service-order-card">
        <div class="card-body service-order-card-body">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Nova OS</h4>

            <button
              class="btn btn-outline-secondary btn-sm"
              type="button"
              (click)="goBack()"
            >
              Voltar
            </button>
          </div>

          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label>Nome do cliente</label>
                <input
                  class="form-control"
                  formControlName="customerName"
                  placeholder="Ex: João Silva"
                />
              </div>

              <div class="col-md-6 mb-3">
                <label>Telefone</label>
                <input
                  class="form-control"
                  formControlName="customerPhone"
                  placeholder="Ex: (11) 99999-9999"
                />
              </div>

              <div class="col-md-6 mb-3">
                <label>Veículo</label>
                <input
                  class="form-control"
                  formControlName="vehicle"
                  placeholder="Ex: Honda Civic"
                />
              </div>

              <div class="col-md-6 mb-3">
                <label>Placa</label>
                <input
                  class="form-control"
                  formControlName="plate"
                  placeholder="Ex: ABC-1234"
                />
              </div>

              <div class="col-md-6 mb-3">
                <label>Prioridade</label>
                <select class="form-control" formControlName="priority">
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <label>Responsável</label>
                <input
                  class="form-control"
                  formControlName="assignedTo"
                  placeholder="Ex: Rafael"
                />
              </div>

              <div class="col-12 mb-3">
                <label>Descrição do problema</label>
                <textarea
                  class="form-control"
                  rows="4"
                  formControlName="problemDescription"
                  placeholder="Descreva o problema informado pelo cliente"
                ></textarea>
              </div>

              <div class="col-12 mb-4">
                <label>Observações</label>
                <textarea
                  class="form-control"
                  rows="4"
                  formControlName="notes"
                  placeholder="Observações internas da oficina"
                ></textarea>
              </div>
            </div>

            <button
              class="btn btn-primary"
              type="submit"
              [disabled]="form.invalid || saving"
            >
              {{ saving ? 'Salvando...' : 'Salvar OS' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .service-order-page {
        width: 100%;
        min-height: calc(100vh - 80px);
        background: #f3f4f6;
        padding: 24px;
      }

      .service-order-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
        overflow: hidden;
      }

      .service-order-card-body {
        background: #ffffff;
        padding: 32px;
      }

      label {
        display: block;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 8px;
      }

      .form-control {
        background-color: #ffffff;
        color: #111827;
        border: 1px solid #dbe1ea;
        border-radius: 8px;
        min-height: 48px;
      }

      .form-control::placeholder {
        color: #64748b;
      }

      textarea.form-control {
        min-height: 140px;
        resize: vertical;
      }

      .btn-primary {
        min-width: 138px;
      }
    `,
  ],
})
export class ServiceOrderCreatePageComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly serviceOrderService = inject(ServiceOrderService);

  saving = false;

  readonly form = this.fb.group({
    customerName: ['', Validators.required],
    customerPhone: [''],
    vehicle: [''],
    plate: [''],
    problemDescription: ['', Validators.required],
    status: ['ABERTA' as ServiceOrderStatus],
    priority: ['MEDIA' as ServiceOrderPriority, Validators.required],
    assignedTo: [''],
    notes: [''],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    this.serviceOrderService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/kanban']);
      },
      error: (err) => {
        console.error('Erro ao criar OS', err);
        this.saving = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/kanban']);
  }
}