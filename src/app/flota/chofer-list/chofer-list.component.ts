import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { ChoferList } from 'src/app/interfaces/chofer';
import { Column } from 'src/app/interfaces/column';
import { TableEvent } from 'src/app/interfaces/table';
import { ChoferService } from 'src/app/services/chofer.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  ciudad?: string;
  pais?: string;
  tipo_documento?: string;
};

@Component({
  selector: 'app-chofer-list',
  templateUrl: './chofer-list.component.html',
  styleUrls: ['./chofer-list.component.scss'],
})
export class ChoferListComponent implements OnInit {
  modelo = m.CHOFER;
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: ChoferList) => element.id,
      sticky: true,
    },
    {
      def: 'nombre',
      title: 'Nombre o Razón Social',
      value: (element: ChoferList) => element.nombre,
      sticky: true,
    },
    {
      def: 'tipo_documento',
      title: 'Tipo de Documento',
      value: (element: ChoferList) => element.tipo_documento_descripcion,
    },
    {
      def: 'pais_emisor_documento',
      title: 'País Emisor del Documento',
      value: (element: ChoferList) => element.pais_emisor_documento_nombre,
    },
    {
      def: 'numero_documento',
      title: 'Número de Documento',
      value: (element: ChoferList) => element.numero_documento,
    },
    {
      def: 'gestor_cuenta_nombre',
      title: 'Gestor de Cuenta',
      value: (element: ChoferList) => element.gestor_cuenta_nombre,
    },
    {
      def: 'oficial_cuenta_nombre',
      title: 'Oficial de Cuenta',
      value: (element: ChoferList) => element.oficial_cuenta_nombre,
    },
    {
      def: 'direccion',
      title: 'Dirección',
      value: (element: ChoferList) => element.direccion,
    },
    {
      def: 'ubicacion',
      title: 'Ubicación',
      value: (element: ChoferList) =>
        `${element.ciudad_nombre}/${element.localidad_nombre}/${element.pais_nombre_corto}`,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: ChoferList) => element.estado,
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: ChoferList[] = [];
  ciudadFilterList: string[] = [];
  ciudadFiltered: string[] = [];
  paisFilterList: string[] = [];
  paisFiltered: string[] = [];
  tipoDocumentoFilterList: string[] = [];
  tipoDocumentoFiltered: string[] = [];

  get isFilteredByCiudad(): boolean {
    return this.ciudadFiltered.length !== this.ciudadFilterList.length;
  }

  get isFilteredByPais(): boolean {
    return this.paisFiltered.length !== this.paisFilterList.length;
  }

  get isFilteredByTipoDocumento(): boolean {
    return (
      this.tipoDocumentoFiltered.length !== this.tipoDocumentoFilterList.length
    );
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('ciudadCheckboxFilter')
  ciudadCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('paisCheckboxFilter') paisCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('tipoDocumentoCheckboxFilter')
  tipoDocumentoCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private choferService: ChoferService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  redirectToCreate(): void {
    this.router.navigate([`/flota/${m.CHOFER}/${a.CREAR}`]);
  }

  redirectToEdit(event: TableEvent<ChoferList>): void {
    this.router.navigate([`/flota/${m.CHOFER}/${a.EDITAR}`, event.row.id]);
  }

  redirectToShow(event: TableEvent<ChoferList>): void {
    this.router.navigate([`/flota/${m.CHOFER}/${a.VER}`, event.row.id]);
  }

  deleteRow(event: TableEvent<ChoferList>): void {
    const row = event.row;
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          message: `¿Está seguro que desea eliminar el Chofer ${row.nombre}`,
        },
      })
      .afterClosed()
      .pipe(filter((confirmed: boolean) => confirmed))
      .subscribe(() => {
        this.choferService.delete(row.id).subscribe(() => {
          this.snackbar
            .open('Eliminado satisfactoriamente', 'Ok')
            .afterDismissed()
            .subscribe(() => {
              this.getList();
            });
        });
      });
  }

  downloadFile(): void {
    this.choferService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: ChoferList, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByCiudad =
      filter.ciudad
        ?.split('|')
        .some((x) => obj.ciudad_nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByPais =
      filter.pais
        ?.split('|')
        .some((x) => obj.pais_nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByTipoDocumento =
      filter.tipo_documento
        ?.split('|')
        .some(
          (x) => obj.tipo_documento_descripcion.toLowerCase().indexOf(x) >= 0
        ) ?? true;
    return filterByCiudad && filterByPais && filterByTipoDocumento;
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.ciudadFiltered = this.ciudadCheckboxFilter.getFilteredList();
    this.paisFiltered = this.paisCheckboxFilter.getFilteredList();
    this.tipoDocumentoFiltered =
      this.tipoDocumentoCheckboxFilter.getFilteredList();
    if (this.isFilteredByCiudad) {
      filter.ciudad = this.ciudadFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByPais) {
      filter.pais = this.paisFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByTipoDocumento) {
      filter.tipo_documento = this.tipoDocumentoFiltered.join('|');
      this.isFiltered = true;
    }
    this.filter(
      this.isFiltered ? JSON.stringify(filter) : '',
      !this.isFiltered
    );
  }

  resetFilter(): void {
    this.resetFilterList();
    this.filter('');
  }

  private getList(): void {
    this.choferService.getList().subscribe((list) => {
      this.list = list;
      this.ciudadFilterList = getFilterList(list, (x) => x.ciudad_nombre);
      this.paisFilterList = getFilterList(list, (x) => x.pais_nombre);
      this.tipoDocumentoFilterList = getFilterList(
        list,
        (x) => x.tipo_documento_descripcion
      );
      this.resetFilterList();
    });
  }

  private filter(
    filter: string,
    isFilteredByGlobalSearch: boolean = true
  ): void {
    this.searchService.search(filter, isFilteredByGlobalSearch);
    this.accordion.closeAll();
  }

  private resetFilterList(): void {
    this.isFiltered = false;
    this.ciudadFiltered = this.ciudadFilterList.slice();
    this.paisFiltered = this.paisFilterList.slice();
    this.tipoDocumentoFiltered = this.tipoDocumentoFilterList.slice();
  }
}
