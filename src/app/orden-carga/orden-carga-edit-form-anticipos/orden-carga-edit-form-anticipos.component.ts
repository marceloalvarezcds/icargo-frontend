import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Column } from 'src/app/interfaces/column';
import { TableEvent } from 'src/app/interfaces/table';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { PermisoAccionEnum, PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { create, edit, remove } from 'src/app/utils/table-event-crud';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OcAnticipoRetiradoFormDialogComponent } from 'src/app/dialogs/oc-anticipo-retirado-form-dialog/oc-anticipo-retirado-form-dialog.component';
import { OrdenCargaAnticipoRetiradoService } from 'src/app/services/orden-carga-anticipo-retirado.service';
import { OcAnticipoRetiradoDialogData } from 'src/app/interfaces/oc-anticipo-retirado-dialog-data';

@Component({
  selector: 'app-orden-carga-edit-form-anticipos',
  templateUrl: './orden-carga-edit-form-anticipos.component.html',
  styleUrls: ['./orden-carga-edit-form-anticipos.component.scss']
})
export class OrdenCargaEditFormAnticiposComponent {

  a = PermisoAccionEnum;
  columns: Column[] = [
    { def: 'id', title: 'Nº', value: (element: OrdenCargaAnticipoRetirado) => element.id, sticky: true },
    { def: 'tipo_anticipo_descripcion', title: 'Tipo de Anticipo', value: (element: OrdenCargaAnticipoRetirado) => element.tipo_anticipo_descripcion },
    { def: 'proveedor_nombre', title: 'Proveedor', value: (element: OrdenCargaAnticipoRetirado) => element.proveedor_nombre },
    { def: 'punto_venta_pais_nombre', title: 'País', value: (element: OrdenCargaAnticipoRetirado) => element.punto_venta_pais_nombre },
    { def: 'monto_retirado', title: 'Monto retirado', value: (element: OrdenCargaAnticipoRetirado) => element.monto_retirado, type: 'number' },
    { def: 'moneda_nombre', title: 'Moneda', value: (element: OrdenCargaAnticipoRetirado) => element.moneda_nombre },
    { def: 'monto_equiv', title: 'Monto Equiv.', value: (element: OrdenCargaAnticipoRetirado) => element.monto_retirado, type: 'number' },
    { def: 'gestor_carga_moneda_nombre', title: 'Moneda Equiv.', value: (element: OrdenCargaAnticipoRetirado) => element.gestor_carga_moneda_nombre },
    { def: 'created_by', title: 'Usuario creación', value: (element: OrdenCargaAnticipoRetirado) => element.created_by },
    { def: 'created_at', title: 'Fecha creación', value: (element: OrdenCargaAnticipoRetirado) => element.created_at },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  modelo = m.ORDEN_CARGA_ANTICIPO_RETIRADO;

  get isAnticiposLiberados(): boolean {
    return !!this.oc?.anticipos_liberados;
  }

  @Input() oc?: OrdenCarga;
  @Input() gestorCargaId?: number;
  @Input() isShow = false;
  @Input() list: OrdenCargaAnticipoRetirado[] = [];

  @Output() ocChange = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private ordenCargaAnticipoRetiradoService: OrdenCargaAnticipoRetiradoService,
  ) { }

  create(): void {
    create(this.getDialogRef(), this.emitOcChange.bind(this));
  }

  edit({ row }: TableEvent<OrdenCargaAnticipoRetirado>): void {
    edit(this.getDialogRef(row), this.emitOcChange.bind(this));
  }

  remove({ row }: TableEvent<OrdenCargaAnticipoRetirado>): void {
    remove(this.dialog, `¿Está seguro que desea eliminar el anticipo ${row.tipo_anticipo_descripcion}?`, () => {
      this.ordenCargaAnticipoRetiradoService.delete(row.id).subscribe(this.emitOcChange.bind(this));
    });
  }

  private getDialogRef(item?: OrdenCargaAnticipoRetirado): MatDialogRef<OcAnticipoRetiradoFormDialogComponent, OrdenCargaAnticipoRetirado> {
    const data: OcAnticipoRetiradoDialogData = {
      orden_carga_id: this.oc!.id,
      flete_id: this.oc!.flete_id,
      item,
    }
    return this.dialog.open(OcAnticipoRetiradoFormDialogComponent, { data });
  }

  private emitOcChange(): void {
    this.ocChange.emit();
  }
}
