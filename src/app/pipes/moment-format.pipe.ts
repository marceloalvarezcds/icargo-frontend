import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentFormat',
})
export class MomentFormatPipe implements PipeTransform {
  transform(
    value: string | Date | moment.Moment | null,
    dateFormat: string
  ): string {
    if (!value) {
      return '';
    }
    const date = typeof value === 'string' ? new Date(value) : value;
    return moment(date).format(dateFormat);
  }
}
