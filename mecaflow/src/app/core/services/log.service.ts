import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class LogService {
  private readonly http = inject(HttpClient);
  private readonly auditEndpoint = `${environment.apiUrl}/audit/logs`;

  debug(message: string, context: string, details?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context, details);
  }

  info(message: string, context: string, details?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context, details);
  }

  warn(message: string, context: string, details?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context, details);
  }

  error(message: string, context: string, details?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context, details);
  }

  private log(level: LogLevel, message: string, context: string, details?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      ...(details && { details }),
    };

    this.writeToConsole(entry);
  }

  private sendToBackend(entry: LogEntry): void {
    this.http
      .post(this.auditEndpoint, entry)
      .subscribe({
        error: () => this.writeToConsole({
          ...entry,
          message: `[FALLBACK] ${entry.message} (failed to send to audit endpoint)`,
        }),
      });
  }

  private writeToConsole(entry: LogEntry): void {
    const formatted = `[${entry.level}] [${entry.context}] ${entry.timestamp} - ${entry.message}`;
    const consoleMethods: Record<LogLevel, (...args: unknown[]) => void> = {
      [LogLevel.DEBUG]: console.debug,
      [LogLevel.INFO]: console.info,
      [LogLevel.WARN]: console.warn,
      [LogLevel.ERROR]: console.error,
    };

    const method = consoleMethods[entry.level];
    if (entry.details) {
      method(formatted, entry.details);
    } else {
      method(formatted);
    }
  }
}
