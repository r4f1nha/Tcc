import {
  Directive,
  ElementRef,
  inject,
  output,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent } from 'rxjs';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective implements OnInit {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  readonly appClickOutside = output<MouseEvent>();

  ngOnInit(): void {
    fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter((event) => {
          const target = event.target as HTMLElement;
          return !this.elementRef.nativeElement.contains(target);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.appClickOutside.emit(event);
      });
  }
}
