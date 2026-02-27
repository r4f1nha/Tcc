import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-search-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <!-- Search Icon -->
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          class="w-4 h-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>

      <!-- Input -->
      <input
        #searchInput
        type="text"
        [placeholder]="placeholder()"
        [value]="value()"
        class="w-full pl-10 pr-10 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1a1d27] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/50 focus:border-[#4F6EF7] transition-colors"
      />

      <!-- Clear Button -->
      @if (value()) {
        <button
          type="button"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          (click)="clearSearch()"
          aria-label="Limpar busca"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      }
    </div>
  `,
})
export class SearchInputComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly placeholder = input('Buscar...');
  readonly debounceMs = input(300);

  readonly searchChanged = output<string>();

  readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');
  readonly value = signal('');

  ngOnInit(): void {
    // Defer subscription to next tick so the viewChild is available
    setTimeout(() => this.setupDebounce());
  }

  clearSearch(): void {
    const inputEl = this.searchInput().nativeElement;
    inputEl.value = '';
    this.value.set('');
    this.searchChanged.emit('');
    inputEl.focus();
  }

  private setupDebounce(): void {
    const inputEl = this.searchInput().nativeElement;

    fromEvent<Event>(inputEl, 'input')
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(this.debounceMs()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((query) => {
        this.value.set(query);
        this.searchChanged.emit(query);
      });
  }
}
