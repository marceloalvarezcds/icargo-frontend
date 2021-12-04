import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-color-field',
  templateUrl: './color-field.component.html',
  styleUrls: ['./color-field.component.scss']
})
export class ColorFieldComponent {

  list$ = this.colorService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'color_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Color';

  constructor(private colorService: ColorService) { }
}
