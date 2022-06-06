import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChoferService } from 'src/app/services/chofer.service';

@Component({
  selector: 'app-chofer-field',
  templateUrl: './chofer-field.component.html',
  styleUrls: ['./chofer-field.component.scss'],
})
export class ChoferFieldComponent {
  list$ = this.choferService.getListByWithoutCamion();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'chofer_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Chofer';

  constructor(private choferService: ChoferService) {}
}
