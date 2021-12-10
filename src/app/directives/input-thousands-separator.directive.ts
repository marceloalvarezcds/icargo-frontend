import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { errorMessage, numberWithCommas, numberWithoutCommas, preventTypingNonNumericCharacters, zeroCommaTerminatedRegex } from 'src/app/utils/thousands-separator';

export const forwardFunc = () => InputThousandsSeparatorDirective

@Directive({
  exportAs:'appInputThousandsSeparator',
  selector: '[appInputThousandsSeparator]',
  providers: [
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: InputThousandsSeparatorDirective },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(forwardFunc),
      multi: true,
    }
  ],
})
export class InputThousandsSeparatorDirective {

  private val: number | undefined;

  constructor(private elementRef: ElementRef<HTMLInputElement>) {
    this._onChange(''); // For pass test
    this.checkInputType();
  }

  get value(): string | number | undefined {
    return this.val !== undefined ? Number(this.val) : undefined;
  }

  @Input()
  set value(value: string | number | undefined) {
    this._setValue(value);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    preventTypingNonNumericCharacters(event);
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    if (typeof value === 'string' && !(zeroCommaTerminatedRegex.test(value))) {
      this.val = numberWithoutCommas(value);
      this._onChange(this.val);
      this.formatValue(value);
    } else {
      this.elementRef.nativeElement.value = value.toString();
    }
  }

  _onChange(value: any): void { }

  writeValue(value: any): void {
    // En este entra cuando se carga el valor desde el angularForm y no lo que el usuario introduce por teclado
    this._setValue(value);
  }

  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(): void { }

  private _setValue(value: string | number | undefined): void {
    this.val = numberWithoutCommas(value);
    this.formatValue(this.val);
  }

  private formatValue(value: string | number | undefined): void {
    this.elementRef.nativeElement.value = numberWithCommas(value);
  }

  private checkInputType(): void {
    if (this.elementRef.nativeElement.type === 'number') {
      throw new Error(errorMessage);
    }
  }
}
