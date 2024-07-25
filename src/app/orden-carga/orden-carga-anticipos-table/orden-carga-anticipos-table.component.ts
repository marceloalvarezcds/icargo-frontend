import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PermisoModeloEnum } from 'src/app/enums/permiso-enum';
import { DialogFieldComponent } from 'src/app/form-field/dialog-field/dialog-field.component';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { FleteList } from 'src/app/interfaces/flete';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { FleteService } from 'src/app/services/flete.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReportsService } from 'src/app/services/reports.service';
import { OrdenCargaAnticipoRetiradoService } from 'src/app/services/orden-carga-anticipo-retirado.service';
import { create, edit, remove } from 'src/app/utils/table-event-crud';
import { TableEvent } from 'src/app/interfaces/table';
import * as saveAs from 'file-saver';
import { OcAnticipoRetiradoFormDialogComponent } from 'src/app/dialogs/oc-anticipo-retirado-form-dialog/oc-anticipo-retirado-form-dialog.component';
import { OcAnticipoRetiradoDialogData } from 'src/app/interfaces/oc-anticipo-retirado-dialog-data';

@Component({
  selector: 'app-orden-carga-anticipos-table',
  templateUrl: './orden-carga-anticipos-table.component.html',
  styleUrls: ['./orden-carga-anticipos-table.component.scss']
})
export class OrdenCargaAnticiposTableComponent {

  a = PermisoAccionEnum;
  columns: Column[] = [
    {
      def: 'pdf',
      title: '',
      type: 'button',
      value: () => 'PDF',
      buttonCallback: (element: OrdenCargaAnticipoRetirado) =>
        this.downloadPDF(element),
      sticky: true,
    },
    {
      def: 'id',
      title: 'Nº',
      value: (element: OrdenCargaAnticipoRetirado) => element.id,
    },
    {
      def: 'concepto',
      title: 'Concepto',
      value: (element: OrdenCargaAnticipoRetirado) => element.concepto,
    },
    {
      def: 'proveedor_nombre',
      title: 'Proveedor',
      value: (element: OrdenCargaAnticipoRetirado) => element.proveedor_nombre,
    },
    {
      def: 'punto_venta_pais_nombre',
      title: 'País',
      value: (element: OrdenCargaAnticipoRetirado) =>
        element.punto_venta_pais_nombre,
    },
    {
      def: 'monto_retirado',
      title: 'Monto retirado',
      value: (element: OrdenCargaAnticipoRetirado) => element.monto_retirado,
      type: 'number',
    },
    {
      def: 'moneda_nombre',
      title: 'Moneda',
      value: (element: OrdenCargaAnticipoRetirado) => element.moneda_nombre,
    },
    {
      def: 'monto_equiv',
      title: 'Monto Equiv.',
      value: (element: OrdenCargaAnticipoRetirado) => element.monto_retirado,
      type: 'number',
    },
    {
      def: 'gestor_carga_moneda_nombre',
      title: 'Moneda Equiv.',
      value: (element: OrdenCargaAnticipoRetirado) =>
        element.gestor_carga_moneda_nombre,
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: OrdenCargaAnticipoRetirado) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: OrdenCargaAnticipoRetirado) => element.created_at,
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: OrdenCargaAnticipoRetirado) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: OrdenCargaAnticipoRetirado) => element.modified_at,
      type: 'date',
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  modelo = m.ORDEN_CARGA_ANTICIPO_RETIRADO;

  get isAnticiposLiberados(): boolean {
    return !!this.oc?.anticipos_liberados;
  }

  @Input() oc?: OrdenCarga;
  @Input() gestorCargaId?: number;
  @Input() isShow = false;
  @Input() puedeConciliar = false;
  @Input() list: OrdenCargaAnticipoRetirado[] = [];

  @Output() ocChange = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private ordenCargaAnticipoRetiradoService: OrdenCargaAnticipoRetiradoService,
    private reportsService: ReportsService
  ) {}

  create(): void {
    create(this.getDialogRef(), this.emitOcChange.bind(this));
  }

  edit({ row }: TableEvent<OrdenCargaAnticipoRetirado>): void {
    edit(this.getDialogRef(row), this.emitOcChange.bind(this));
  }

  remove({ row }: TableEvent<OrdenCargaAnticipoRetirado>): void {
    remove(
      this.dialog,
      `¿Está seguro que desea eliminar el anticipo ${row.tipo_anticipo_descripcion}?`,
      () => {
        this.ordenCargaAnticipoRetiradoService
          .delete(row.id)
          .subscribe(this.emitOcChange.bind(this));
      }
    );
  }

  private downloadPDF(item: OrdenCargaAnticipoRetirado): void {
    this.ordenCargaAnticipoRetiradoService
      .pdf(item.id)
      .subscribe((filename) => {
        this.reportsService.downloadFile(filename).subscribe((file) => {
          saveAs(file, filename);
        });
      });
  }

  private getDialogRef(
    item?: OrdenCargaAnticipoRetirado
  ): MatDialogRef<
    OcAnticipoRetiradoFormDialogComponent,
    OrdenCargaAnticipoRetirado
  > {
    const data: OcAnticipoRetiradoDialogData = {
      orden_carga_id: this.oc!.id,
      flete_id: this.oc!.flete_id,
      item,
    };
    return this.dialog.open(OcAnticipoRetiradoFormDialogComponent, { data });
  }

  private emitOcChange(): void {
    this.ocChange.emit();
  }

}
