import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgClass } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly fullWidth = input(false);

  readonly clicked = output<MouseEvent>();

  get variantClasses(): string {
    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-[#4F6EF7] hover:bg-[#3b5ae0] text-white focus:ring-[#4F6EF7]/50 disabled:bg-[#4F6EF7]/50',
      secondary:
        'bg-transparent border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 focus:ring-slate-300',
      danger:
        'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/50 disabled:bg-red-600/50',
      ghost:
        'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 focus:ring-slate-300',
    };
    return variants[this.variant()];
  }

  get sizeClasses(): string {
    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };
    return sizes[this.size()];
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
