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
    <div class="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 class="text-2xl font-bold text-white">Configurações</h1>
        <p class="text-sm text-slate-400 mt-1">Configurações da oficina</p>
      </div>

      @if (loading()) {
        <app-skeleton variant="card" />
      } @else {
        <form [formGroup]="form" (ngSubmit)="onSave()" class="space-y-6">
          <!-- Workshop Info -->
          <div class="bg-[#22263a] rounded-xl border border-slate-700/50 p-6 space-y-4">
            <h2 class="text-sm font-semibold text-white">Dados da Oficina</h2>

            <div>
              <label class="block text-xs text-slate-400 mb-1">Nome da oficina</label>
              <input formControlName="workshopName"
                class="w-full px-3 py-2 bg-[#1a1d27] border border-slate-600/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4F6EF7]" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-slate-400 mb-1">Telefone</label>
                <input formControlName="phone"
                  class="w-full px-3 py-2 bg-[#1a1d27] border border-slate-600/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4F6EF7]" />
              </div>
              <div>
                <label class="block text-xs text-slate-400 mb-1">Endereço</label>
                <input formControlName="address"
                  class="w-full px-3 py-2 bg-[#1a1d27] border border-slate-600/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4F6EF7]" />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-xs text-slate-400 mb-1">Início expediente</label>
                <input formControlName="workingHoursStart" type="time"
                  class="w-full px-3 py-2 bg-[#1a1d27] border border-slate-600/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4F6EF7]" />
              </div>
              <div>
                <label class="block text-xs text-slate-400 mb-1">Fim expediente</label>
                <input formControlName="workingHoursEnd" type="time"
                  class="w-full px-3 py-2 bg-[#1a1d27] border border-slate-600/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4F6EF7]" />
              </div>
              <div>
                <label class="block text-xs text-slate-400 mb-1">Duração do slot (min)</label>
                <input formControlName="slotDurationMinutes" type="number"
                  class="w-full px-3 py-2 bg-[#1a1d27] border border-slate-600/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4F6EF7]" />
              </div>
            </div>
          </div>

          <button type="submit" [disabled]="saving() || form.invalid"
            class="px-6 py-2.5 bg-[#4F6EF7] hover:bg-[#3d5ae0] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
            {{ saving() ? 'Salvando...' : 'Salvar configurações' }}
          </button>
        </form>
      }
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
