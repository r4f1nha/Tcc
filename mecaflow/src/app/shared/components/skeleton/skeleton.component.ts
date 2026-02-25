import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';
import { NgClass } from '@angular/common';

export type SkeletonVariant = 'text' | 'circle' | 'card' | 'table-row';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (variant()) {
      @case ('text') {
        <div class="space-y-2">
          @for (line of lines(); track $index) {
            <div
              [ngClass]="[
                'h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse',
                $last ? 'w-3/4' : 'w-full'
              ]"
            ></div>
          }
        </div>
      }
      @case ('circle') {
        <div
          [ngClass]="[
            circleSize(),
            'rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse'
          ]"
        ></div>
      }
      @case ('card') {
        <div class="rounded-xl bg-white dark:bg-[#22263a] border border-slate-200 dark:border-slate-700 p-4 space-y-4 animate-pulse">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 rounded bg-slate-200 dark:bg-slate-700 w-1/3"></div>
              <div class="h-3 rounded bg-slate-200 dark:bg-slate-700 w-1/4"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="h-3 rounded bg-slate-200 dark:bg-slate-700 w-full"></div>
            <div class="h-3 rounded bg-slate-200 dark:bg-slate-700 w-5/6"></div>
            <div class="h-3 rounded bg-slate-200 dark:bg-slate-700 w-2/3"></div>
          </div>
        </div>
      }
      @case ('table-row') {
        <div class="flex items-center gap-4 py-3 px-4 animate-pulse">
          <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <div class="flex-1 grid grid-cols-4 gap-4">
            <div class="h-3 rounded bg-slate-200 dark:bg-slate-700 col-span-1"></div>
            <div class="h-3 rounded bg-slate-200 dark:bg-slate-700 col-span-1"></div>
            <div class="h-3 rounded bg-slate-200 dark:bg-slate-700 col-span-1"></div>
            <div class="h-3 rounded bg-slate-200 dark:bg-slate-700 col-span-1"></div>
          </div>
        </div>
      }
    }
  `,
})
export class SkeletonComponent {
  readonly variant = input<SkeletonVariant>('text');
  readonly count = input(3);
  readonly circleWidth = input<'sm' | 'md' | 'lg'>('md');

  readonly lines = computed(() => Array.from({ length: this.count() }));

  readonly circleSize = computed(() => {
    const sizes: Record<string, string> = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
    };
    return sizes[this.circleWidth()];
  });
}
