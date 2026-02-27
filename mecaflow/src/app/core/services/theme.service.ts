import { computed, effect, Injectable, signal } from '@angular/core';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

const THEME_STORAGE_KEY = 'mecaflow-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly currentTheme = signal<Theme>(this.loadPersistedTheme());
  readonly isDark = computed(() => this.currentTheme() === Theme.DARK);

  constructor() {
    effect(() => {
      const theme = this.currentTheme();
      this.applyThemeToDocument(theme);
      this.persistTheme(theme);
    });
  }

  toggleTheme(): void {
    this.currentTheme.update((current) =>
      current === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
    );
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  private loadPersistedTheme(): Theme {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === Theme.DARK || stored === Theme.LIGHT) {
      return stored;
    }
    return this.detectSystemPreference();
  }

  private detectSystemPreference(): Theme {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? Theme.DARK : Theme.LIGHT;
  }

  private applyThemeToDocument(theme: Theme): void {
    const body = document.body;
    body.classList.remove(Theme.LIGHT, Theme.DARK);
    body.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  private persistTheme(theme: Theme): void {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}
