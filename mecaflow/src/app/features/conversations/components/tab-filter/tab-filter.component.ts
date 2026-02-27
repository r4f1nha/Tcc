import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ConversationTab } from '../../models/conversation.model';

@Component({
  selector: 'app-tab-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="nav nav-tabs border-bottom px-3 pt-2">
      @for (tab of tabs; track tab.value) {
        <li class="nav-item">
          <button type="button" class="nav-link d-flex align-items-center gap-1"
            [class.active]="activeTab() === tab.value"
            (click)="tabChanged.emit(tab.value)"
            style="border:none; background:none; font-size:0.82rem; padding:0.5rem 0.75rem;">
            {{ tab.label }}
            @if (tab.value === 'BOT' && counts().bot > 0) {
              <span class="badge badge-danger badge-pill ml-1">{{ counts().bot }}</span>
            }
            @if (tab.value === 'HUMAN' && counts().human > 0) {
              <span class="badge badge-primary badge-pill ml-1">{{ counts().human }}</span>
            }
            @if (tab.value === 'RESOLVED' && counts().resolved > 0) {
              <span class="badge badge-secondary badge-pill ml-1">{{ counts().resolved }}</span>
            }
          </button>
        </li>
      }
    </ul>
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
