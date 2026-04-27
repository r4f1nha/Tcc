import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  ServiceOrder,
  ServiceOrderPriority,
  ServiceOrderStatus,
} from '../../models/service-order';
import { ServiceOrderService } from '../../services/service-order.service';

@Component({
  selector: 'app-service-order-detail-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="detail-page">
      <div class="detail-card">
        <div class="detail-header">
          <h4>Editar OS</h4>

          <button class="btn btn-outline-secondary btn-sm" type="button" (click)="goBack()">
            Voltar
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label>Nome do cliente</label>
              <input class="form-control" formControlName="customerName" />
            </div>

            <div class="col-md-6 mb-3">
              <label>Telefone</label>
              <input class="form-control" formControlName="customerPhone" />
            </div>

            <div class="col-md-6 mb-3">
              <label>Veículo</label>
              <input class="form-control" formControlName="vehicle" />
            </div>

            <div class="col-md-6 mb-3">
              <label>Placa</label>
              <input class="form-control" formControlName="plate" />
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
              <label>Status</label>
              <select class="form-control" formControlName="status">
                <option value="ABERTA">Aberta</option>
                <option value="EM_ANALISE">Em análise</option>
                <option value="AGUARDANDO_CLIENTE">Aguardando cliente</option>
                <option value="FINALIZADA">Finalizada</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>

            <div class="col-12 mb-3">
              <label>Descrição</label>
              <textarea class="form-control" rows="4" formControlName="problemDescription"></textarea>
            </div>

            <div class="col-12 mb-4">
              <label>Observações</label>
              <textarea class="form-control" rows="4" formControlName="notes"></textarea>
            </div>
          </div>

          <div class="actions">
            <button
              class="btn btn-primary save-button"
              type="submit"
              [disabled]="form.invalid || saving || deleting"
            >
              {{ saving ? 'Salvando...' : 'Salvar alterações' }}
            </button>

            <button
              class="btn btn-danger delete-button"
              type="button"
              [disabled]="saving || deleting"
              (click)="deleteOrder()"
            >
              {{ deleting ? 'Excluindo...' : 'Excluir OS' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .detail-page {
        width: 100%;
        min-height: calc(100vh - 80px);
        background: #f3f4f6;
        padding: 24px;
      }

      .detail-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
        padding: 32px;
        overflow: hidden;
      }

      .detail-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 28px;
      }

      h4 {
        color: #111827;
        font-size: 28px;
        font-weight: 700;
        margin: 0;
      }

      label {
        display: block;
        font-weight: 600;
        color: #111827;
        margin-bottom: 8px;
      }

      .form-control {
        background-color: #ffffff;
        color: #111827;
        border: 1px solid #dbe1ea;
        border-radius: 8px;
        min-height: 48px;
      }

      textarea.form-control {
        min-height: 140px;
        resize: vertical;
      }

      .actions {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .save-button,
      .delete-button {
        min-width: 170px;
        min-height: 44px;
        border-radius: 8px;
        font-weight: 600;
      }
    `,
  ],
})
export class ServiceOrderDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(ServiceOrderService);

  saving = false;
  deleting = false;
  id!: number;

  readonly form = this.fb.group({
    customerName: ['', Validators.required],
    customerPhone: [''],
    vehicle: [''],
    plate: [''],
    problemDescription: ['', Validators.required],
    status: ['ABERTA' as ServiceOrderStatus],
    priority: ['MEDIA' as ServiceOrderPriority],
    assignedTo: [''],
    notes: [''],
  });

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.service.getById(this.id).subscribe({
      next: (order: ServiceOrder) => {
        this.form.patchValue(order);
      },
      error: (err) => {
        console.error('Erro ao carregar OS', err);
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    this.service.update(this.id, this.form.getRawValue()).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/kanban']);
      },
      error: (err) => {
        console.error('Erro ao salvar', err);
        this.saving = false;
      },
    });
  }

  deleteOrder(): void {
    const confirmed = window.confirm('Tem certeza que deseja excluir esta OS?');

    if (!confirmed) {
      return;
    }

    this.deleting = true;

    this.service.delete(this.id).subscribe({
      next: () => {
        this.deleting = false;
        this.router.navigate(['/kanban']);
      },
      error: (err) => {
        console.error('Erro ao excluir OS', err);
        this.deleting = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/kanban']);
  }
}