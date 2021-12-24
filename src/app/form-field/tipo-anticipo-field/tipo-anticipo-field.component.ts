import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TipoAnticipo } from 'src/app/interfaces/tipo-anticipo';
import { TipoAnticipoService } from 'src/app/services/tipo-anticipo.service';

@Component({
  selector: 'app-tipo-anticipo-field',
  templateUrl: './tipo-anticipo-field.component.html',
  styleUrls: ['./tipo-anticipo-field.component.scss']
})
export class TipoAnticipoFieldComponent {

  list$ = this.tipoAnticipoService.getList();

  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'tipo_anticipo_id';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() title = 'Tipo de Anticipo';

  constructor(private tipoAnticipoService: TipoAnticipoService) { }

  compareWith(o1?: TipoAnticipo, o2?: TipoAnticipo): boolean {
    return o1?.id === o2?.id;
  }
}
