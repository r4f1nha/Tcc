import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  readonly isOpen = input(false);
  readonly title = input('');
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly closeOnOverlay = input(true);

  readonly closed = output<void>();

  get sizeClasses(): string {
    const sizes: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
    };
    return sizes[this.size()];
  }

  onOverlayClick(): void {
    if (this.closeOnOverlay()) {
      this.closed.emit();
    }
  }

  onClose(): void {
    this.closed.emit();
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.closed.emit();
    }
  }
}
