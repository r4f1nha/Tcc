import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { ToastService, ToastType } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          [ngClass]="[
            getToastClasses(toast.type),
            'pointer-events-auto rounded-lg px-4 py-3 shadow-lg ring-1 transition-all duration-300 animate-slide-in'
          ]"
          role="alert"
        >
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div class="flex-shrink-0 mt-0.5">
              @switch (toast.type) {
                @case ('success') {
                  <svg class="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                @case ('error') {
                  <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                }
                @case ('warning') {
                  <svg class="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                }
                @case ('info') {
                  <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                }
              }
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              @if (toast.title) {
                <p class="text-sm font-semibold text-slate-900 dark:text-white">
                  {{ toast.title }}
                </p>
              }
              <p class="text-sm text-slate-600 dark:text-slate-300">
                {{ toast.message }}
              </p>
            </div>

            <!-- Close -->
            <button
              type="button"
              class="flex-shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              (click)="toastService.dismiss(toast.id)"
              aria-label="Fechar notificacao"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `],
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);

  getToastClasses(type: ToastType): string {
    const classes: Record<ToastType, string> = {
      success:
        'bg-white dark:bg-[#22263a] ring-emerald-200 dark:ring-emerald-800/50',
      error:
        'bg-white dark:bg-[#22263a] ring-red-200 dark:ring-red-800/50',
      warning:
        'bg-white dark:bg-[#22263a] ring-amber-200 dark:ring-amber-800/50',
      info:
        'bg-white dark:bg-[#22263a] ring-blue-200 dark:ring-blue-800/50',
    };
    return classes[type];
  }
}
