import { Directive, HostListener, Input, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

function phoneNumberFormat(text: string | null) {
  return text?.replace(/ /g, '') ?? '';
}

@Directive({
  selector: '[appFormatToPastePhone]',
})
export class FormatToPastePhoneDirective {
  @Input() appFormatToPastePhone: string | boolean = true;

  constructor(@Self() private ngControl: NgControl) {}

  @HostListener('paste', ['$event'])
  onKeyDown(event: ClipboardEvent): void {
    if (
      (this.appFormatToPastePhone || this.appFormatToPastePhone === '') &&
      this.ngControl.control &&
      event.clipboardData
    ) {
      event.preventDefault();
      const text = event.clipboardData.getData('text/plain');
      const value = phoneNumberFormat(text);
      this.ngControl.control.setValue(value);
    }
  }
}
