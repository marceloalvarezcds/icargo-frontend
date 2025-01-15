import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Column } from 'src/app/interfaces/column';
import { CombinacionList } from 'src/app/interfaces/combinacion';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { CombinacionService } from 'src/app/services/combinacion.service';
import { FormGroup } from '@angular/forms';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { DialogFieldLocalComponent } from '../dialog-field-local/dialog-field-local.component';

@Component({
  selector: 'app-combinacion-dialog-field',
  templateUrl: './combinacion-dialog-field.component.html',
  styleUrls: ['./combinacion-dialog-field.component.scss']
})
export class CombinacionDialogFieldComponent   implements AfterViewInit {
  readonly inputValuePropName = 'camion_placa';
  //list$?: Observable<CombinacionList[]>;
  cId?: number;
  id?: number;
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'ID',
      value: (element: CombinacionList) => element.id,
    },
    {
      def: 'camion_placa',
      title: 'Tracto',
      value: (element: CombinacionList) => element.camion_placa,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: CombinacionList) => element.estado,
    },
    {
      def: 'chofer_nombre',
      title: 'Chofer',
      value: (element: CombinacionList) => element.chofer_nombre,
    },
    {
      def: 'doc',
      title: 'Documento',
      value: (element: CombinacionList) => element.chofer.numero_documento,
    },
    {
      def: 'marca',
      title: 'Marca',
      value: (element: CombinacionList) => element.marca_descripcion,
    },
    {
      def: 'color',
      title: 'Color',
      value: (element: CombinacionList) => element.color_camion,
    },
    {
      def: 'propietario',
      title: 'Propietario',
      value: (element: CombinacionList) => element.propietario_nombre,
    },
    {
      def: 'neto',
      title: 'Neto',
      value: (element: CombinacionList) => element.neto?.toLocaleString('de-DE'),
    },
  ];

  @Input() combinacionEvents?: Observable<CombinacionList>;
  @Input() combinacion?: CombinacionList;
  @Input() controlName = 'combinacion_id';
  @Input() form!: FormGroup;
  @Input() groupName = '';
  @Input() title = 'TRACTOS';

  @Output() valueChange = new EventEmitter<CombinacionList | undefined>();

  @ViewChild('app-dialog-field-local') dialogField?: DialogFieldLocalComponent<CombinacionList>;

  fetchFunction = () => this.service.getList();

  constructor(private service: CombinacionService) { }

  ngAfterViewInit(): void {
    //this.getList();
    null;
  }

  //private getList(): void {
  //  this.list$ = this.service.getList();
  //}

}
