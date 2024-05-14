import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChoferList } from 'src/app/interfaces/chofer';
import { Column } from 'src/app/interfaces/column';
import { SemiList } from 'src/app/interfaces/semi';
import { ChoferService } from 'src/app/services/chofer.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-chofer-by-propietario-dialog-field',
  templateUrl: './chofer-by-propietario-dialog-field.component.html',
  styleUrls: ['./chofer-by-propietario-dialog-field.component.scss']
})
export class ChoferByPropietarioDialogFieldComponent {
  readonly inputValuePropName = 'nombre';
  list$?: Observable<ChoferList[]>;
  cId?: number;
  sId?: number;
  id?: number;
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: ChoferList) => element.id,
    },
    {
      def: 'Documento',
      title: 'N. Documento',
      value: (element: ChoferList) => element.numero_documento,
    },
    {
      def: 'nombre',
      title: 'Nombre',
      value: (element: ChoferList) => element.nombre,
    },
    {
      def: 'celular',
      title: 'Celular',
      value: (element: ChoferList) => element.telefono,
    },
  ];

  @Input() controlName = 'camion_id';
  @Input() form!: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Chofer';
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
  @Output() valueChange = new EventEmitter<ChoferList | undefined>();
  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<ChoferList>;

  constructor(private service: ChoferService) {
    this.getList();
  }

  private getList(): void {
    this.list$ = this.service.getList();
  }
}
