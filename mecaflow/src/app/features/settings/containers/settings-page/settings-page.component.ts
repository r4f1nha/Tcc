import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { WorkshopSettings } from '../../models/settings.model';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [ReactiveFormsModule, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Cabeçalho -->
    <div class="row mb-1">
      <div class="col-12">
        <div class="content-header">
          <i class="fas fa-cog header-icon"></i>&nbsp;Configurações
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-8 col-xl-6">
        @if (loading()) {
          <app-skeleton variant="card" />
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSave()">
            <!-- Workshop Info -->
            <div class="card mb-3">
              <div class="card-header">
                <h6 class="card-title mb-0"><i class="fas fa-store mr-2"></i>Dados da Oficina</h6>
              </div>
              <div class="card-body">
                <div class="form-group">
                  <label class="font-weight-600" style="font-size:0.85rem;">Nome da oficina</label>
                  <input formControlName="workshopName" type="text" class="form-control form-control-sm"
                    placeholder="Nome da sua oficina" />
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="font-weight-600" style="font-size:0.85rem;">Telefone</label>
                      <input formControlName="phone" type="text" class="form-control form-control-sm"
                        placeholder="(00) 00000-0000" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="font-weight-600" style="font-size:0.85rem;">Endereço</label>
                      <input formControlName="address" type="text" class="form-control form-control-sm"
                        placeholder="Endereço completo" />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label class="font-weight-600" style="font-size:0.85rem;">Início expediente</label>
                      <input formControlName="workingHoursStart" type="time" class="form-control form-control-sm" />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label class="font-weight-600" style="font-size:0.85rem;">Fim expediente</label>
                      <input formControlName="workingHoursEnd" type="time" class="form-control form-control-sm" />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label class="font-weight-600" style="font-size:0.85rem;">Duração do slot (min)</label>
                      <input formControlName="slotDurationMinutes" type="number" class="form-control form-control-sm"
                        min="15" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="saving() || form.invalid">
              @if (saving()) {
                <span class="spinner-border spinner-border-sm mr-1" role="status"></span>Salvando...
              } @else {
                <i class="fas fa-save mr-1"></i>Salvar configurações
              }
            </button>
          </form>
        }
      </div>
    </div>
  `,
})
export class SettingsPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly settingsService = inject(SettingsService);

  readonly loading = signal(true);
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    workshopName: ['', Validators.required],
    phone: ['', Validators.required],
    address: [''],
    workingHoursStart: ['08:00', Validators.required],
    workingHoursEnd: ['18:00', Validators.required],
    slotDurationMinutes: [60, [Validators.required, Validators.min(15)]],
  });

  ngOnInit(): void {
    this.settingsService.getWorkshopSettings().subscribe({
      next: (settings) => {
        this.form.patchValue(settings);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSave(): void {
    if (this.form.valid) {
      this.saving.set(true);
      this.settingsService.updateWorkshopSettings(this.form.getRawValue()).subscribe({
        next: () => this.saving.set(false),
        error: () => this.saving.set(false),
      });
    }
  }
}
