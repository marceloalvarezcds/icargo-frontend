import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { PermisoAccionEnum as a, PermisoAccionEnum, PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { PuntoVentaList } from 'src/app/interfaces/punto-venta';
import { TableEvent } from 'src/app/interfaces/table';
import { PuntoVentaService } from 'src/app/services/punto-venta.service';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-punto-venta-list',
  templateUrl: './punto-venta-list.component.html',
  styleUrls: ['./punto-venta-list.component.scss']
})
export class PuntoVentaListComponent {

  a = PermisoAccionEnum;
  modelo = m.PUNTO_VENTA;
  columns: Column[] = [
    { def: 'nombre', title: 'Nombre', value: (element: PuntoVentaList) => element.nombre, sticky: true },
    { def: 'nombre_corto', title: 'Nombre de Fantasía', value: (element: PuntoVentaList) => element.nombre_corto },
    { def: 'tipo_documento', title: 'Tipo de Documento', value: (element: PuntoVentaList) => element.tipo_documento_descripcion },
    { def: 'numero_documento', title: 'Número de Documento', value: (element: PuntoVentaList) => element.numero_documento },
    { def: 'composicion_juridica', title: 'Composición Jurídica', value: (element: PuntoVentaList) => element.composicion_juridica_nombre },
    { def: 'direccion', title: 'Dirección', value: (element: PuntoVentaList) => element.direccion },
    { def: 'ubicacion', title: 'Ubicación', value: (element: PuntoVentaList) => `${element.ciudad_nombre}/${element.localidad_nombre}/${element.pais_nombre_corto}` },
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
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  redirectToEdit(event: TableEvent<PuntoVentaList>): void {
    this.router.navigate([`/entities/${m.PUNTO_VENTA}/${a.EDITAR}`, this.provId, event.row.id], { queryParams: { backUrl: this.backUrl }});
  }

  redirectToShow(event: TableEvent<PuntoVentaList>): void {
    this.router.navigate([`/entities/${m.PUNTO_VENTA}/${a.VER}`, this.provId, event.row.id], { queryParams: { backUrl: this.backUrl }});
  }

  deleteRow(event: TableEvent<PuntoVentaList>): void {
    const row = event.row;
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          message: `¿Está seguro que desea eliminar el Punto de Venta ${row.nombre}`,
        },
      })
      .afterClosed()
      .pipe(filter((confirmed: boolean) => confirmed))
      .subscribe(() => {
        this.puntoVentaService.delete(row.id).subscribe(() => {
          this.snackbar.open('Eliminado satisfactoriamente', 'Ok')
            .afterDismissed()
            .subscribe(() => {
              this.getList(this.provId!);
            });
        });
      });
  }

  downloadFile(): void {
    this.puntoVentaService.generateReports(this.provId!).subscribe(filename => {
      this.reportsService.downloadFile(filename).subscribe(file => {
        saveAs(file, filename);
      });
    });
  }

  private getList(proveedorId: number): void {
    this.puntoVentaService.getList(proveedorId).subscribe(list => {
      this.list = list;
    });
  }
}
