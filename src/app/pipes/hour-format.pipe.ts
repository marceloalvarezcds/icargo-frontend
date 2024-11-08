import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourFormat'
})
export class HourFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';  // Si el valor está vacío, retornamos vacío
    
    // Aseguramos que el valor tenga el formato adecuado
    const parts = value.split(':');
    
    if (parts.length === 2) {
      let [hour, minute] = parts;
      hour = this.formatTimeUnit(hour);
      minute = this.formatTimeUnit(minute);
      return `${hour}:${minute}`;
    }

    return value; // Si el valor no tiene el formato adecuado, lo devolvemos tal cual
  }

  // Función para agregar un 0 al inicio si el número es menor a 10
  private formatTimeUnit(unit: string): string {
    return unit.length === 1 ? '0' + unit : unit;
  }

}
