import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unidad } from 'src/app/interfaces/unidad';

@Component({
  selector: 'app-flete-form-condicion-afectado',
  templateUrl: './flete-form-condicion-afectado.component.html',
  styleUrls: ['./flete-form-condicion-afectado.component.scss'],
})
export class FleteFormCondicionAfectadoComponent {

  groupName = 'condicion';
  formGroup?: FormGroup;

  @Input() set form(f: FormGroup) {
    this.formGroup = f;

    this.group.get(`condicion_${this.afectado}_moneda`)?.valueChanges.subscribe((item:any)=> {
      this.cargarSelec(item);
    });

    this.group.get(`condicion_${this.afectado}_unidad_id`)?.valueChanges.subscribe((item:any)=> {
      //this.cargarSelecUnidad(item);
    })

  }

  @Input() afectado = 'gestor_carga';

  get group(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  cargarSelec(moneda:any):void {

    this.group.get(`condicion_${this.afectado}_moneda_id`)?.setValue(moneda?.id);
    this.group.get(`condicion_${this.afectado}_moneda_simbolo`)?.setValue(moneda?.simbolo)
  }

  cargarSelecUnidad(unidad:Unidad | undefined):void {
    if (!unidad === undefined) return;
    //this.group.get(`condicion_${this.afectado}_unidad_id`)?.setValue(unidad?.id);
    this.group.get(`condicion_${this.afectado}_unidad_abreviatura`)?.setValue(unidad?.abreviatura);
  }

}
