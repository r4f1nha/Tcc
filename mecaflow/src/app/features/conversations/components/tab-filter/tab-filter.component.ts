import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ConversationTab } from '../../models/conversation.model';

@Component({
  selector: 'app-tab-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex border-b border-slate-700/50">
      @for (tab of tabs; track tab.value) {
        <button
          type="button"
          (click)="tabChanged.emit(tab.value)"
          [class]="activeTab() === tab.value
            ? 'text-[#4F6EF7] border-[#4F6EF7]'
            : 'text-slate-400 border-transparent hover:text-slate-300'"
          class="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all">
          {{ tab.label }}
          @if (tab.value === 'BOT' && counts().bot > 0) {
            <span class="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
              {{ counts().bot }}
            </span>
          }
          @if (tab.value === 'HUMAN' && counts().human > 0) {
            <span class="bg-[#4F6EF7] text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
              {{ counts().human }}
            </span>
          }
          @if (tab.value === 'RESOLVED' && counts().resolved > 0) {
            <span class="bg-slate-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
              {{ counts().resolved }}
            </span>
          }
        </button>
      }
    </div>
  `,
})
export class TabFilterComponent {
  readonly activeTab = input.required<ConversationTab>();
  readonly counts = input.required<{ bot: number; human: number; resolved: number }>();
  readonly tabChanged = output<ConversationTab>();

  readonly tabs: ReadonlyArray<{ label: string; value: ConversationTab }> = [
    { label: 'Bot', value: ConversationTab.BOT },
    { label: 'Humano', value: ConversationTab.HUMAN },
    { label: 'Resolvidas', value: ConversationTab.RESOLVED },
  ];
}
