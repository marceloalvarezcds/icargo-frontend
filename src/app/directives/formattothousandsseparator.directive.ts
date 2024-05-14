import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appFormatToThousandsSeparator]'
})
export class FormatToThousandsSeparatorDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: any) {
    const initialValue = this.el.nativeElement.value;
    if (!initialValue) return;

    // Remove commas
    const valueWithoutCommas = initialValue.replace(/,/g, '');

    // Format the value with thousands separators
    const formattedValue = valueWithoutCommas.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Set the formatted value back to the input field
    this.el.nativeElement.value = formattedValue;
  }
}
