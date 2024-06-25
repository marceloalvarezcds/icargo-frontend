import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { PuntoVentaList } from 'src/app/interfaces/punto-venta';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { PuntoVentaService } from 'src/app/services/punto-venta.service';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-punto-venta-list',
  templateUrl: './punto-venta-list.component.html',
  styleUrls: ['./punto-venta-list.component.scss'],
})
export class PuntoVentaListComponent {
  a = PermisoAccionEnum;
  modelo = m.PUNTO_VENTA;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: PuntoVentaList) => element.id,
      sticky: true,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: PuntoVentaList) => element.estado.toUpperCase(),
    },
    {
      def: 'nombre',
      title: 'Puntos de Venta',
      value: (element: PuntoVentaList) => element.nombre,
    },
    {
      def: 'proveedor',
      title: 'Proveedor',
      value: (element: PuntoVentaList) => element.proveedor_nombre,
    },
    {
      def: 'direccion',
      title: 'Dirección',
      value: (element: PuntoVentaList) => element.direccion,
    },
    {
      def: 'ubicacion',
      title: 'Ubicación',
      value: (element: PuntoVentaList) => element.localidad_nombre,
    },
    {
      def: 'numero_documento',
      title: 'Nº Doc.',
      value: (element: PuntoVentaList) => element.numero_documento,
    },
    {
      def: 'tipo_documento',
      title: 'Tipo de Doc.',
      value: (element: PuntoVentaList) => element.tipo_documento_descripcion,
    },
    {
      def: 'composicion_juridica',
      title: 'Comp. Jurídica',
      value: (element: PuntoVentaList) => element.composicion_juridica_nombre,
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  list: PuntoVentaList[] = [];
  provId?: number;

  @Input() set proveedorId(id: number | undefined) {
    if (id) {
      this.provId = id;
      this.getList(id);
    }
  }

  @Input() isShow = false;
  @Input() backUrl = '/entities/proveedor/create';

  constructor(
    private puntoVentaService: PuntoVentaService,
    private reportsService: ReportsService,
    private dialog: DialogService,
    private router: Router
  ) {}

  redirectToEdit(event: TableEvent<PuntoVentaList>): void {
    this.router.navigate(
      [`/entities/${m.PUNTO_VENTA}/${a.EDITAR}`, this.provId, event.row.id],
      { queryParams: { backUrl: this.backUrl } }
    );
  }

  redirectToShow(event: TableEvent<PuntoVentaList>): void {
    this.router.navigate(
      [`/entities/${m.PUNTO_VENTA}/${a.VER}`, this.provId, event.row.id],
      { queryParams: { backUrl: this.backUrl } }
    );
  }

  deleteRow({ row }: TableEvent<PuntoVentaList>): void {
    const message = `¿Está seguro que desea eliminar el Punto de Venta ${row.nombre}?`;
    this.dialog.confirmationToDelete(
      message,
      this.puntoVentaService.delete(row.id),
      () => {
        this.getList(this.provId!);
      }
    );
  }

  downloadFile(): void {
    this.puntoVentaService
      .generateReports(this.provId!)
      .subscribe((filename) => {
        this.reportsService.downloadFile(filename).subscribe((file) => {
          saveAs(file, filename);
        });
      });
  }

  private getList(proveedorId: number): void {
    this.puntoVentaService.getList(proveedorId).subscribe((list) => {
      this.list = list;
    });
  }
}
