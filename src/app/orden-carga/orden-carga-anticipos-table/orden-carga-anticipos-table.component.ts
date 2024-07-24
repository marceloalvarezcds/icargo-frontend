import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PermisoModeloEnum } from 'src/app/enums/permiso-enum';
import { DialogFieldComponent } from 'src/app/form-field/dialog-field/dialog-field.component';
import { Column } from 'src/app/interfaces/column';
import { FleteList } from 'src/app/interfaces/flete';
import { FleteService } from 'src/app/services/flete.service';

@Component({
  selector: 'app-orden-carga-anticipos-table',
  templateUrl: './orden-carga-anticipos-table.component.html',
  styleUrls: ['./orden-carga-anticipos-table.component.scss']
})
export class OrdenCargaAnticiposTableComponent {
  readonly inputValuePropName = 'info';
  list: FleteList[] = [];
  subs = this.fleteService.getListByGestorCarga().subscribe((list) => {
    this.list = list;
  });
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
    },
    {
      def: 'remitente_nombre',
      title: 'PDF',
    },
    {
      def: 'producto_descripcion',
      title: 'Proveedor',
      
    },
    {
      def: 'pais',
      title: 'Pais',
      
    },
    {
      def: 'Monto',
      title: 'Monto',
      
    },
    {
      def: 'Moneda',
      title: 'Moneda',
      
    },
    {
      def: 'Monto_Equiv.',
      title: 'Monto Equiv.',
      
    },
    {
      def: 'Moneda_Equiv.',
      title: 'Monto Equiv.',
      
    },
    {
      def: 'created.',
      title: 'Usuario Creacion.',
      
    },
    {
      def: 'created_at.',
      title: 'Usuario Modificacion.',
      
    },
    {
      def: 'created_by.',
      title: 'Fecha Modificacion.',
      
    },

  ];

  @Input() form!: FormGroup;
  @Input() controlName = 'flete_id';
  @Input() groupName = '';
  @Input() title = 'Pedido';

  @Output() valueChange = new EventEmitter<FleteList>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<FleteList>;
  constructor(private fleteService: FleteService) { }



}
