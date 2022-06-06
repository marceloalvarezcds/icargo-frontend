import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CamionSemiNetoFormDialogComponent } from 'src/app/dialogs/camion-semi-neto-form-dialog/camion-semi-neto-form-dialog.component';
import {
  PermisoAccionEnum,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';
import { Camion } from 'src/app/interfaces/camion';
import { CamionSemiNeto } from 'src/app/interfaces/camion-semi-neto';
import { CamionSemiNetoFormDialogData } from 'src/app/interfaces/camion-semi-neto-form-dialog-data';
import { Column } from 'src/app/interfaces/column';
import { TableEvent } from 'src/app/interfaces/table';
import { CamionSemiNetoService } from 'src/app/services/camion-semi-neto.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { create, edit, remove } from 'src/app/utils/table-event-crud';

@Component({
  selector: 'app-camion-form-combinacion',
  templateUrl: './camion-form-combinacion.component.html',
  styleUrls: ['./camion-form-combinacion.component.scss'],
})
export class CamionFormCombinacionComponent {
  a = PermisoAccionEnum;
  m = PermisoModeloEnum;
  item?: Camion;
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: CamionSemiNeto) => element.id,
      sticky: true,
    },
    {
      def: 'camion_info',
      title: 'Camión',
      value: (element: CamionSemiNeto) =>
        `Nº ${element.camion_id}: (${element.camion_info})`,
    },
    {
      def: 'semi_info',
      title: 'Semi',
      value: (element: CamionSemiNeto) =>
        `Nº ${element.semi_id}: (${element.semi_info})`,
    },
    {
      def: 'producto_info',
      title: 'Producto',
      value: (element: CamionSemiNeto) => element.producto_info,
    },
    {
      def: 'neto',
      title: 'Neto',
      value: (element: CamionSemiNeto) => element.neto,
      type: 'number',
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: CamionSemiNeto) => element.estado,
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: CamionSemiNeto) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: CamionSemiNeto) => element.created_at,
      type: 'date',
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: CamionSemiNeto) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: CamionSemiNeto) => element.modified_at,
      type: 'date',
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];
  list: CamionSemiNeto[] = [];

  @Input() gestorCargaId?: number;
  @Input() isShow = false;
  @Input() set camion(c: Camion | undefined) {
    this.item = c;
    this.getList();
  }

  constructor(
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private camionSemiNetoService: CamionSemiNetoService
  ) {}

  create(): void {
    create(this.getDialogRef(), () => {
      this.emitChange('Combinación creada');
    });
  }

  edit({ row }: TableEvent<CamionSemiNeto>): void {
    edit(this.getDialogRef(row), () => {
      this.emitChange('Combinación modificada');
    });
  }

  remove({ row }: TableEvent<CamionSemiNeto>): void {
    const productoMessage = row.producto_id
      ? ` - Producto Nº: ${row.producto_id}`
      : '';
    remove(
      this.dialog,
      `¿Está seguro que desea eliminar a la Combinación Camion Nº: ${row.camion_id} - Semi Nº: ${row.semi_id}${productoMessage}?`,
      () => {
        this.camionSemiNetoService.delete(row.id).subscribe(() => {
          this.emitChange('Combinación eliminada');
        });
      }
    );
  }

  private getDialogRef(
    item?: CamionSemiNeto
  ): MatDialogRef<CamionSemiNetoFormDialogComponent, CamionSemiNeto> {
    const data: CamionSemiNetoFormDialogData = {
      item,
      camion_id: this.item!.id,
      camion_info: this.item!.info,
    };
    return this.dialog.open(CamionSemiNetoFormDialogComponent, { data });
  }

  private getList(): void {
    if (this.item) {
      this.camionSemiNetoService
        .getListByCamionId(this.item.id)
        .subscribe((list) => {
          this.list = list;
        });
    }
  }

  private emitChange(message: string): void {
    this.snackbar.open(message);
    this.getList();
  }
}
