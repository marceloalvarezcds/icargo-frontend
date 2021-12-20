import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TipoAnticipoService } from 'src/app/services/tipo-anticipo.service';

@Component({
  selector: 'app-tipo-anticipo-field',
  templateUrl: './tipo-anticipo-field.component.html',
  styleUrls: ['./tipo-anticipo-field.component.scss']
})
export class TipoAnticipoFieldComponent {

  list$ = this.tipoAnticipoService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'tipo_anticipo_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Tipo de Anticipo';

  constructor(private tipoAnticipoService: TipoAnticipoService) { }
}
