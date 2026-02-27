import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [ngClass]="variantClasses"
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style="font-family: 'JetBrains Mono', monospace"
    >
      @if (dot()) {
        <span
          [ngClass]="[dotClasses, 'w-1.5 h-1.5 rounded-full mr-1.5']"
        ></span>
      }
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('neutral');
  readonly dot = input(false);

  get variantClasses(): string {
    const variants: Record<BadgeVariant, string> = {
      success:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      warning:
        'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      danger:
        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      info:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      neutral:
        'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    };
    return variants[this.variant()];
  }

  get dotClasses(): string {
    const dots: Record<BadgeVariant, string> = {
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      danger: 'bg-red-500',
      info: 'bg-blue-500',
      neutral: 'bg-slate-400',
    };
    return dots[this.variant()];
  }
}
