import {
  Directive,
  effect,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { UserRole } from '../../core/auth/models/user.model';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authService = inject(AuthService);

  private isRendered = false;

  readonly appHasRole = input.required<ReadonlyArray<UserRole>>();

  constructor() {
    effect(() => {
      const roles = this.appHasRole();
      const hasPermission = this.authService.hasAnyRole(roles);

      if (hasPermission && !this.isRendered) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isRendered = true;
      } else if (!hasPermission && this.isRendered) {
        this.viewContainer.clear();
        this.isRendered = false;
      }
    });
  }
}
