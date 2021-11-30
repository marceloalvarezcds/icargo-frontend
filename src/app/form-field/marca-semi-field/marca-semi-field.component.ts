import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MarcaSemiService } from 'src/app/services/marca-semi.service';

@Component({
  selector: 'app-marca-semi-field',
  templateUrl: './marca-semi-field.component.html',
  styleUrls: ['./marca-semi-field.component.scss']
})
export class MarcaSemiFieldComponent {

  list$ = this.marcaSemiService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'marca_semi_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Marca de Semi-remolque';

  constructor(private marcaSemiService: MarcaSemiService) { }
}
