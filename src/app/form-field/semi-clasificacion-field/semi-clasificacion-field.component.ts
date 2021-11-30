import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SemiClasificacionService } from 'src/app/services/semi-clasificacion.service';

@Component({
  selector: 'app-semi-clasificacion-field',
  templateUrl: './semi-clasificacion-field.component.html',
  styleUrls: ['./semi-clasificacion-field.component.scss']
})
export class SemiClasificacionFieldComponent {

  list$ = this.semiClasificacionService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'semi_clasificacion_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Clasificación de Semi-remolque';

  constructor(private semiClasificacionService: SemiClasificacionService) { }
}
