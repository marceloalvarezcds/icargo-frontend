import { Pipe, PipeTransform } from '@angular/core';
import { numberWith2Commas } from 'src/app/utils/thousands-separator';

@Pipe({
  name: 'numberDecimalFormat'
})
export class NumberDecimalFormatPipe implements PipeTransform {
  transform(value: string | number | null | undefined): string | undefined {
    return value === undefined || value === null || isNaN(+value)
      ? undefined
      : numberWith2Commas(value);
  }
}
