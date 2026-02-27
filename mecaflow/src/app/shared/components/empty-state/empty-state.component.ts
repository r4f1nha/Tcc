import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
      <!-- Icon Slot -->
      @if (icon()) {
        <div class="mb-4 text-slate-300 dark:text-slate-600">
          <svg
            class="w-16 h-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              [attr.d]="icon()"
            />
          </svg>
        </div>
      } @else {
        <div class="mb-4">
          <ng-content select="[empty-icon]" />
        </div>
      }

      <!-- Title -->
      <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
        {{ title() }}
      </h3>

      <!-- Description -->
      @if (description()) {
        <p class="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
          {{ description() }}
        </p>
      }

      <!-- Action -->
      @if (actionLabel()) {
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#4F6EF7] hover:bg-[#3b5ae0] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/50"
          (click)="actionClicked.emit()"
        >
          {{ actionLabel() }}
        </button>
      }

      <!-- Custom content slot -->
      <ng-content />
    </div>
  `,
})
export class EmptyStateComponent {
  readonly title = input('Nenhum item encontrado');
  readonly description = input('');
  readonly icon = input('');
  readonly actionLabel = input('');

  readonly actionClicked = output<void>();
}
