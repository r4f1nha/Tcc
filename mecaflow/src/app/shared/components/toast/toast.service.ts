import { computed, Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  readonly id: string;
  readonly type: ToastType;
  readonly message: string;
  readonly title?: string;
  readonly duration: number;
}

interface ToastOptions {
  readonly title?: string;
  readonly duration?: number;
}

const DEFAULT_DURATION = 5000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastList = signal<ReadonlyArray<Toast>>([]);
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  readonly toasts = computed(() => this.toastList());

  success(message: string, options?: ToastOptions): void {
    this.addToast('success', message, options);
  }

  error(message: string, options?: ToastOptions): void {
    this.addToast('error', message, options);
  }

  warning(message: string, options?: ToastOptions): void {
    this.addToast('warning', message, options);
  }

  info(message: string, options?: ToastOptions): void {
    this.addToast('info', message, options);
  }

  dismiss(id: string): void {
    this.removeToast(id);
  }

  clearAll(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.toastList.set([]);
  }

  private addToast(type: ToastType, message: string, options?: ToastOptions): void {
    const id = this.generateId();
    const duration = options?.duration ?? DEFAULT_DURATION;

    const toast: Toast = {
      id,
      type,
      message,
      title: options?.title,
      duration,
    };

    this.toastList.update((toasts) => [...toasts, toast]);

    if (duration > 0) {
      const timer = setTimeout(() => this.removeToast(id), duration);
      this.timers.set(id, timer);
    }
  }

  private removeToast(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.toastList.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
