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
  @Input() shouldFormat: boolean = true; // Propiedad para controlar el formateo

  getFormattedValue(): string {
    if (this.shouldFormat && (typeof this.value === 'number' || (typeof this.value === 'string' && !isNaN(Number(this.value))))) {
      return this.formatNumberWithDots(Number(this.value));
    }
    // Convierte el valor a string antes de retornarlo
    return String(this.value || '');
  }

  private formatNumberWithDots(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
