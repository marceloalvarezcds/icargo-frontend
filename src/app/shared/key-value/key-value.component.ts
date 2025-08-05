import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-key-value',
  templateUrl: './key-value.component.html',
  styleUrls: ['./key-value.component.scss'],
})
export class KeyValueComponent {
  @Input() key: string | undefined;
  @Input() value: string | number | null | undefined;
  @Input() inline = true;
  @Input() shouldFormat: boolean = true;
  @Input() suffix: string = '';


  getFormattedValue(): string {
    // Si el valor es string y contiene etiquetas HTML, devolver sin formatear ni agregar sufijo
    if (typeof this.value === 'string' && this.value.includes('<br>')) {
      return this.value;
    }

    if (
      this.shouldFormat &&
      (typeof this.value === 'number' || (typeof this.value === 'string' && !isNaN(Number(this.value))))
    ) {
      const formattedValue = this.formatNumberWithDots(Number(this.value));
      const currency = this.extractCurrency(this.value);
      return `${formattedValue} ${currency}${this.suffix}`;
    }

    // Por defecto, devolver valor como string con sufijo
    return `${String(this.value || '')}${this.suffix}`;
  }


  private extractCurrency(value: string | number): string {
    if (typeof value === 'string') {
      const parts = value.split(' ');
      if (parts.length > 1) {
        return parts[1];
      }
    }
    return '';
  }

  private formatNumberWithDots(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

}
