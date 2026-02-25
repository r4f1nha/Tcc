import { Pipe, PipeTransform } from '@angular/core';

interface TimeInterval {
  readonly label: string;
  readonly seconds: number;
}

const INTERVALS: ReadonlyArray<TimeInterval> = [
  { label: 'ano', seconds: 31536000 },
  { label: 'mes', seconds: 2592000 },
  { label: 'semana', seconds: 604800 },
  { label: 'dia', seconds: 86400 },
  { label: 'hora', seconds: 3600 },
  { label: 'minuto', seconds: 60 },
  { label: 'segundo', seconds: 1 },
];

const PLURAL_MAP: Readonly<Record<string, string>> = {
  ano: 'anos',
  mes: 'meses',
  semana: 'semanas',
  dia: 'dias',
  hora: 'horas',
  minuto: 'minutos',
  segundo: 'segundos',
};

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: false,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      return '';
    }

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 5) {
      return 'agora mesmo';
    }

    if (seconds < 0) {
      return 'no futuro';
    }

    for (const interval of INTERVALS) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        const label = count === 1 ? interval.label : PLURAL_MAP[interval.label];
        return `ha ${count} ${label}`;
      }
    }

    return 'agora mesmo';
  }
}
