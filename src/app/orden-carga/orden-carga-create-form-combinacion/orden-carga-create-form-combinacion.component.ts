import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FleteList } from 'src/app/interfaces/flete';

@Component({
  selector: 'app-orden-carga-create-form-combinacion',
  templateUrl: './orden-carga-create-form-combinacion.component.html',
  styleUrls: ['./orden-carga-create-form-combinacion.component.scss']
})
export class OrdenCargaCreateFormCombinacionComponent {

  flete?: FleteList;
  groupName = 'combinacion';
  camionId?: number;

  @Input() form?: FormGroup;
  @Output() fleteChange = new EventEmitter<FleteList>();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  onFleteChange(flete: FleteList): void {
    this.flete = flete;
    this.fleteChange.emit(flete);
  }
}
