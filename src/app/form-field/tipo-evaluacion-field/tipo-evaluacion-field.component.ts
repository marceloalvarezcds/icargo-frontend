import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { TipoIncidente} from 'src/app/interfaces/tipo_evaluacion';
import { SeleccionableService } from 'src/app/services/seleccionable.service';
import { TipoEvaluacionService } from 'src/app/services/tipo-evaluacion.service';

@Component({
  selector: 'app-tipo-evaluacion-field',
  templateUrl: './tipo-evaluacion-field.component.html',
  styleUrls: ['./tipo-evaluacion-field.component.scss'],
  providers: [SeleccionableService],
})
export class TipoEvaluacionFieldComponent {
  list$ = this.tipoConceptoEvaluacionService.getList();

  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'tipo_incidente_id';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() title = 'Tipo de Evaluacion';
  @Input() value: (
    v: TipoIncidente
  ) => number | string | TipoIncidente = (
    v: TipoIncidente
  ) => v.id;

  @Output() valueChange = new EventEmitter<TipoIncidente>();

  constructor(
    private tipoConceptoEvaluacionService: TipoEvaluacionService
  ) {}

  compareWith(
    o1?: TipoIncidente,
    o2?: TipoIncidente
  ): boolean {
    return o1?.id === o2?.id;
  }

  textValueFormat(value: TipoIncidente): string {
    return value.descripcion;
  }
}
