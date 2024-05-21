import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
})
export class SlideComponent {
  @Input() control!: FormControl;
  @Input() isShow = false;
  @Input() trueTitle = 'Si';
  @Input() falseTitle = 'No';
  @Input() readonly = false;
  @Output() valueChange = new EventEmitter<boolean>();

  get controlValue(): boolean {
    return !!this.control.value;
  }
}
