import { Directive, HostListener, Input, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { numberWithoutCommas } from 'src/app/utils/thousands-separator';

@Directive({
  selector: '[appFormatToPasteNumber]',
})
export class FormatToPasteNumberDirective {
  @Input() appFormatToPasteNumber: string | boolean = true;

  constructor(@Self() private ngControl: NgControl) {}

  @HostListener('paste', ['$event'])
  onKeyDown(event: ClipboardEvent): void {
    if (
      (this.appFormatToPasteNumber || this.appFormatToPasteNumber === '') &&
      this.ngControl.control &&
      event.clipboardData
    ) {
      event.preventDefault();
      const text = event.clipboardData.getData('text/plain');
      const value = numberWithoutCommas(text)!.toString();
      this.ngControl.control.setValue(value);
    }
  }
}
