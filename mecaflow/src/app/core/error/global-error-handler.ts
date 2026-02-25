import { ErrorHandler, inject, Injectable } from '@angular/core';
import { LogService } from '../services/log.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logService = inject(LogService);

  handleError(error: unknown): void {
    const normalizedError = this.normalizeError(error);

    const details: Record<string, unknown> = {
      stack: normalizedError.stack,
      name: normalizedError.name,
    };

    if (normalizedError.originalError) {
      details['originalError'] = String(normalizedError.originalError);
    }

    this.logService.error(normalizedError.message, 'GlobalErrorHandler', details);
  }

  private normalizeError(error: unknown): NormalizedError {
    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack ?? '',
        name: error.name,
      };
    }

    if (this.isObjectWithRejection(error)) {
      return this.normalizeError(error.rejection);
    }

    return {
      message: String(error),
      stack: '',
      name: 'UnknownError',
      originalError: error,
    };
  }

  private isObjectWithRejection(error: unknown): error is { rejection: unknown } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'rejection' in error
    );
  }
}

interface NormalizedError {
  message: string;
  stack: string;
  name: string;
  originalError?: unknown;
}
