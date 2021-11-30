import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TipoSemiService } from 'src/app/services/tipo-semi.service';

@Component({
  selector: 'app-tipo-semi-field',
  templateUrl: './tipo-semi-field.component.html',
  styleUrls: ['./tipo-semi-field.component.scss']
})
export class TipoSemiFieldComponent {

  list$ = this.tipoSemiService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'tipo_semi_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Tipo de Semi-remolque';

  constructor(private tipoSemiService: TipoSemiService) { }
}
