import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ConversationTab } from '../../models/conversation.model';

@Component({
  selector: 'app-tab-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="d-flex border-bottom" style="background:#fff;">
      @for (tab of tabs; track tab.value) {
        <button
          type="button"
          class="tab-btn flex-fill d-flex align-items-center justify-content-center gap-1 py-2"
          [class.tab-active]="activeTab() === tab.value"
          (click)="tabChanged.emit(tab.value)"
        >
          <span style="font-size:0.78rem;font-weight:500;">{{ tab.label }}</span>
          @if (getCount(tab.value) > 0) {
            <span class="badge badge-pill" style="font-size:0.6rem;background:#6c757d;color:#fff;">
              {{ getCount(tab.value) }}
            </span>
          }
        </button>
      }
    </div>
  `,
  styles: [`
    .tab-btn {
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: #6c757d;
      cursor: pointer;
      transition: all 0.15s;
    }
    .tab-btn:hover { color: #333; background: #f8f9fa; }
    .tab-active { color: #1F93FF !important; border-bottom-color: #1F93FF !important; font-weight: 600 !important; }
  `],
})
export class TabFilterComponent {
  readonly activeTab = input.required<ConversationTab>();
  readonly counts = input.required<{ mine: number; unassigned: number; all: number; resolved: number }>();
  readonly tabChanged = output<ConversationTab>();

  readonly tabs: ReadonlyArray<{ label: string; value: ConversationTab }> = [
    { label: 'Minhas', value: ConversationTab.MINE },
    { label: 'Não atribuídas', value: ConversationTab.UNASSIGNED },
    { label: 'Todas', value: ConversationTab.ALL },
    { label: 'Resolvidas', value: ConversationTab.RESOLVED },
  ];

  getCount(tab: ConversationTab): number {
    const c = this.counts();
    const map: Record<ConversationTab, number> = {
      [ConversationTab.MINE]: c.mine,
      [ConversationTab.UNASSIGNED]: c.unassigned,
      [ConversationTab.ALL]: c.all,
      [ConversationTab.RESOLVED]: c.resolved,
    };
    return map[tab] ?? 0;
  }
}
