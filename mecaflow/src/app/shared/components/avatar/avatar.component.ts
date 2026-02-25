import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { NgClass } from '@angular/common';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative inline-flex">
      @if (src() && !imageError) {
        <img
          [src]="src()"
          [alt]="name()"
          [ngClass]="[sizeClasses(), 'rounded-full object-cover ring-2 ring-white dark:ring-[#22263a]']"
          (error)="onImageError()"
        />
      } @else {
        <div
          [ngClass]="[
            sizeClasses(),
            'rounded-full flex items-center justify-center font-semibold bg-[#4F6EF7] text-white ring-2 ring-white dark:ring-[#22263a]'
          ]"
        >
          <span [ngClass]="fontSizeClasses()">{{ initials() }}</span>
        </div>
      }

      @if (status()) {
        <span
          [ngClass]="[
            statusClasses(),
            statusSizeClasses(),
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-[#22263a]'
          ]"
        ></span>
      }
    </div>
  `,
})
export class AvatarComponent {
  readonly src = input<string | null>(null);
  readonly name = input('');
  readonly size = input<AvatarSize>('md');
  readonly status = input<AvatarStatus | null>(null);

  imageError = false;

  readonly initials = computed(() => {
    const fullName = this.name().trim();
    if (!fullName) return '?';
    const parts = fullName.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  });

  readonly sizeClasses = computed(() => {
    const sizes: Record<AvatarSize, string> = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };
    return sizes[this.size()];
  });

  readonly fontSizeClasses = computed(() => {
    const sizes: Record<AvatarSize, string> = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    };
    return sizes[this.size()];
  });

  readonly statusSizeClasses = computed(() => {
    const sizes: Record<AvatarSize, string> = {
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-3.5 h-3.5',
    };
    return sizes[this.size()];
  });

  statusClasses(): string {
    const status = this.status();
    if (!status) return '';
    const statuses: Record<AvatarStatus, string> = {
      online: 'bg-emerald-500',
      away: 'bg-amber-500',
      busy: 'bg-red-500',
      offline: 'bg-slate-400',
    };
    return statuses[status];
  }

  onImageError(): void {
    this.imageError = true;
  }
}
