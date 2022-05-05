import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';

@Component({
  selector: 'app-orden-carga-edit-form-tramo',
  templateUrl: './orden-carga-edit-form-tramo.component.html',
  styleUrls: ['./orden-carga-edit-form-tramo.component.scss'],
})
export class OrdenCargaEditFormTramoComponent {
  groupName = 'tramo';
  ordenCarga?: OrdenCarga;

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get isNuevoPendiente(): boolean {
    return (
      this.ordenCarga?.estado === EstadoEnum.NUEVO ||
      this.ordenCarga?.estado === EstadoEnum.PENDIENTE
    );
  }

  get destinoControl(): FormControl {
    return this.group.get('destino_id') as FormControl;
  }

  get origenControl(): FormControl {
    return this.group.get('origen_id') as FormControl;
  }

  @Input() puedeModificar = false;
  @Input() puedeConciliar = false;
  @Input() form?: FormGroup;
  @Input() set oc(ordenCarga: OrdenCarga) {
    this.ordenCarga = ordenCarga;
    this.group.disable();
    this.destinoControl.disable();
    this.origenControl.disable();
    if (this.puedeModificar && (this.isNuevoPendiente || this.puedeConciliar)) {
      this.destinoControl.enable();
      this.origenControl.enable();
    }
  }
}
