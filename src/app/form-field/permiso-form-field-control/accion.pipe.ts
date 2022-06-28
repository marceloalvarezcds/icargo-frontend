import { Pipe, PipeTransform } from '@angular/core';
import { capitalize } from 'lodash';

@Pipe({ name: 'accion' })
export class AccionPipe implements PipeTransform {
  transform(accion: string): string {
    return capitalize(accion.split('_').join(' '));
  }
}
