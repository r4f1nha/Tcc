import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';

export type ConfirmDialogVariant = 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          (click)="onCancel()"
        ></div>

        <!-- Dialog -->
        <div
          class="relative w-full max-w-md bg-white dark:bg-[#22263a] rounded-xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-700 p-6"
          (click)="$event.stopPropagation()"
        >
          <!-- Icon -->
          <div class="flex justify-center mb-4">
            @switch (dialogVariant()) {
              @case ('danger') {
                <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
              }
              @case ('warning') {
                <div class="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
              }
              @case ('info') {
                <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </div>
              }
            }
          </div>

          <!-- Title -->
          <h3 class="text-lg font-semibold text-center text-slate-900 dark:text-white mb-2">
            {{ title() }}
          </h3>

          <!-- Message -->
          <p class="text-sm text-center text-slate-500 dark:text-slate-400 mb-6">
            {{ message() }}
          </p>

          <!-- Actions -->
          <div class="flex items-center gap-3 justify-end">
            <app-button
              variant="secondary"
              (clicked)="onCancel()"
            >
              {{ cancelLabel() }}
            </app-button>
            <app-button
              [variant]="dialogVariant() === 'danger' ? 'danger' : 'primary'"
              [loading]="confirmLoading()"
              (clicked)="onConfirm()"
            >
              {{ confirmLabel() }}
            </app-button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  readonly isOpen = input(false);
  readonly title = input('Tem certeza?');
  readonly message = input('Esta acao nao pode ser desfeita.');
  readonly confirmLabel = input('Confirmar');
  readonly cancelLabel = input('Cancelar');
  readonly dialogVariant = input<ConfirmDialogVariant>('danger');
  readonly confirmLoading = input(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
