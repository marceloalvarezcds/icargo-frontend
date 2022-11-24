import * as moment from 'moment';

export function df(
  value: string | Date | null | undefined,
  dateFormat: string = 'DD/MM/YYYY HH:mm'
): string {
  if (!value) {
    return '';
  }
  const date = typeof value === 'string' ? new Date(value) : value;
  return moment(date).format(dateFormat);
}
