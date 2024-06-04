import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Column } from 'src/app/interfaces/column';
import { Combinacion } from 'src/app/interfaces/combinacion';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { CombinacionService } from 'src/app/services/combinacion.service';

@Component({
  selector: 'app-combinacion-readonly-by-id-dialog-field',
  templateUrl: './combinacion-readonly-by-id-dialog-field.component.html',
  styleUrls: ['./combinacion-readonly-by-id-dialog-field.component.scss']
})
export class CombinacionReadonlyByIdDialogFieldComponent {

  readonly inputValuePropName = 'info';
  cId?: number;
  sId?: number;
  id?: number;
  list: Combinacion[] = [];
  combinacion?: Combinacion;

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: Combinacion) => element.id,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: Combinacion) => element.estado,
    },
   
  ];

  @Input() controlName = 'propietario_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Propietario';
  @Input() set camionId(id: number | undefined) {
    this.cId = id;
    this.getList();
  }
  @Input() set propietarioId(id: number | undefined) {
    this.id = id;
    this.getList();
  }
  @Input() set semiId(id: number | undefined) {
    this.sId = id;
    this.getList();
  }

  @Output() valueChange = new EventEmitter<Combinacion | undefined>();

  @ViewChild('app-dialog-field')
  dialogField?: DialogFieldComponent<Combinacion>;

  constructor(private service: CombinacionService) {}

  private getList(): void {
    this.getCombinacion();
    if (this.list.length === 0) {
      const list$ = this.cId
        ? this.service.getListByGestorCuentaByCamionId(this.cId)
        : this.sId
        ? this.service.getListByGestorCuentaBySemiId(this.sId)
        : this.service.getListByGestorCuenta();
      list$.subscribe((list) => {
        this.list = list;
        this.getCombinacion();
      });
    }
  }

  private getCombinacion(): void {
    this.combinacion =
      this.id && this.list.length > 0
        ? this.list.find((p) => p.id === this.id)
        : undefined;
  }
}


