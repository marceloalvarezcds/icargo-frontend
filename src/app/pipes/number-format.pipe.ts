import { Pipe, PipeTransform } from '@angular/core';
import { numberWithCommas } from 'src/app/utils/thousands-separator';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: string | number | undefined): string {
    return numberWithCommas(value);
  }
}
