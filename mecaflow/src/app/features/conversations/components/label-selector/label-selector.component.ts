import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { Label } from '../../models/conversation.model';

@Component({
  selector: 'app-label-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <button
        type="button"
        (click)="isOpen.set(!isOpen())"
        class="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[#22263a] text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors border border-slate-600/50">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
        </svg>
        Etiquetas
      </button>

      @if (isOpen()) {
        <div class="absolute top-full left-0 mt-1 w-48 bg-[#22263a] border border-slate-600/50 rounded-lg shadow-xl z-50 py-1">
          @for (label of availableLabels(); track label.id) {
            <button
              type="button"
              (click)="onToggleLabel(label)"
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-[#1a1d27] transition-colors">
              <div class="w-3 h-3 rounded-full" [style.background-color]="label.color"></div>
              <span class="flex-1 text-left">{{ label.name }}</span>
              @if (isLabelActive(label.id)) {
                <svg class="w-4 h-4 text-[#4F6EF7]" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              }
            </button>
          }
          @empty {
            <p class="px-3 py-2 text-xs text-slate-500">Nenhuma etiqueta disponível</p>
          }
        </div>
      }
    </div>
  `,
})
export class LabelSelectorComponent {
  readonly availableLabels = input.required<ReadonlyArray<Label>>();
  readonly activeLabels = input.required<ReadonlyArray<Label>>();
  readonly labelAdded = output<string>();
  readonly labelRemoved = output<string>();

  readonly isOpen = signal(false);

  isLabelActive(labelId: string): boolean {
    return this.activeLabels().some((l) => l.id === labelId);
  }

  onToggleLabel(label: Label): void {
    if (this.isLabelActive(label.id)) {
      this.labelRemoved.emit(label.id);
    } else {
      this.labelAdded.emit(label.id);
    }
  }
}
