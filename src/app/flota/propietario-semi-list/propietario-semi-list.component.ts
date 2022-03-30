import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { SemiList } from 'src/app/interfaces/semi';
import { TableEvent } from 'src/app/interfaces/table';
import { SemiService } from 'src/app/services/semi.service';
import { confirmationDialogToDelete } from 'src/app/utils/delete';

@Component({
  selector: 'app-propietario-semi-list',
  templateUrl: './propietario-semi-list.component.html',
  styleUrls: ['./propietario-semi-list.component.scss'],
})
export class PropietarioSemiListComponent {
  a = a;
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: SemiList) => element.id,
      sticky: true,
    },
    {
      def: 'placa',
      title: 'Placa',
      value: (element: SemiList) => element.placa,
      sticky: true,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: SemiList) => element.estado,
    },
    {
      def: 'pais_emisor',
      title: 'País Emisor',
      value: (element: SemiList) => element.pais_emisor_placa_nombre,
    },
    {
      def: 'tipo',
      title: 'Tipo de Semi',
      value: (element: SemiList) => element.tipo_descripcion,
    },
    {
      def: 'clasificacion_descripcion',
      title: 'Clasificación',
      value: (element: SemiList) => element.clasificacion_descripcion,
    },
    {
      def: 'tipo_carga_descripcion',
      title: 'Tipo de Carga',
      value: (element: SemiList) => element.tipo_carga_descripcion,
    },
    {
      def: 'marca',
      title: 'Marca',
      value: (element: SemiList) => element.marca_descripcion,
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  id?: number;
  list: SemiList[] = [];
  modelo = m.SEMIRREMOLQUE;

  @Input() isShow = false;
  @Input() gestorCuentaId?: number;
  @Input() backUrl = `/flota/${m.SEMIRREMOLQUE}/${a.LISTAR}`;
  @Input() set propietarioId(id: number | undefined) {
    this.id = id;
    this.getList();
  }

  redirectToCreate(): void {
    this.router.navigate([`/flota/${m.SEMIRREMOLQUE}/${a.CREAR}`], {
      queryParams: { backUrl: this.backUrl, propietarioId: this.id },
    });
  }

  redirectToEdit(event: TableEvent<SemiList>): void {
    this.router.navigate(
      [`/flota/${m.SEMIRREMOLQUE}/${a.EDITAR}`, event.row.id],
      { queryParams: { backUrl: this.backUrl, propietarioId: this.id } }
    );
  }

  redirectToShow(event: TableEvent<SemiList>): void {
    this.router.navigate([`/flota/${m.SEMIRREMOLQUE}/${a.VER}`, event.row.id], {
      queryParams: { backUrl: this.backUrl },
    });
  }

  deleteRow(event: TableEvent<SemiList>): void {
    const row = event.row;
    const message = `¿Está seguro que desea eliminar el Semi-remolque con placa ${row.placa}`;
    confirmationDialogToDelete(
      this.dialog,
      message,
      this.semiService,
      row.id,
      this.snackbar,
      () => {
        this.getList();
      }
    );
  }

  constructor(
    private semiService: SemiService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  private getList(): void {
    if (this.id) {
      this.semiService.getListByPropietarioId(this.id).subscribe((list) => {
        this.list = list;
      });
    }
  }
}
