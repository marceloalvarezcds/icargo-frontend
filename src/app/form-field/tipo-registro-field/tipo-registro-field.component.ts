import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TipoRegistroService } from 'src/app/services/tipo-registro.service';

@Component({
  selector: 'app-tipo-registro-field',
  templateUrl: './tipo-registro-field.component.html',
  styleUrls: ['./tipo-registro-field.component.scss']
})
export class TipoRegistroFieldComponent {

  tipoRegistroList$ = this.tipoRegistroService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'tipo_registro_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Tipo de Registro';

  constructor(private tipoRegistroService: TipoRegistroService) { }
}
