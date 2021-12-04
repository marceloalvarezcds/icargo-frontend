import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {

  @Input() appAutofocus: string | boolean = false;

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    if (this.appAutofocus === '' || this.appAutofocus === true) {
      //Otherwise Angular throws error: Expression has changed after it was checked.
      setTimeout(() => {
        this.el.nativeElement.focus(); //For SSR (server side rendering) this is not safe. Use: https://github.com/angular/angular/issues/15008#issuecomment-285141070)
      }, 1000);
    }
  }
}
