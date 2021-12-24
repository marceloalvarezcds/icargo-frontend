import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-flete-form-tramo',
  templateUrl: './flete-form-tramo.component.html',
  styleUrls: ['./flete-form-tramo.component.scss']
})
export class FleteFormTramoComponent {

  groupName = 'tramo';

  @Input() form?: FormGroup;
}
