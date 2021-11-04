import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Column } from 'src/app/interfaces/column';
import { RemitenteList } from 'src/app/interfaces/remitente';
import { TableEvent } from 'src/app/interfaces/table';
import { RemitenteService } from 'src/app/services/remitente.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  ciudad?: string;
  composicion_juridica?: string;
  pais?: string;
  tipo_documento?: string;
}

@Component({
  selector: 'app-remitente-list',
  templateUrl: './remitente-list.component.html',
  styleUrls: ['./remitente-list.component.scss']
})
export class RemitenteListComponent implements OnInit {

  columns: Column[] = [
    { def: 'nombre', title: 'Nombre', value: (element: RemitenteList) => element.nombre, sticky: true },
    { def: 'nombre_corto', title: 'Nombre de Fantasía', value: (element: RemitenteList) => element.nombre_corto },
    { def: 'tipo_documento', title: 'Tipo de Documento', value: (element: RemitenteList) => element.tipo_documento_descripcion },
    { def: 'numero_documento', title: 'Número de Documento', value: (element: RemitenteList) => element.numero_documento },
    { def: 'composicion_juridica', title: 'Composición Jurídica', value: (element: RemitenteList) => element.composicion_juridica_nombre },
    { def: 'direccion', title: 'Dirección', value: (element: RemitenteList) => element.direccion },
    { def: 'ubicacion', title: 'Ubicación', value: (element: RemitenteList) => `${element.ciudad_nombre}/${element.localidad_nombre}/${element.pais_nombre_corto}` },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: RemitenteList[] = [];
  ciudadFilterList: string[] = [];
  ciudadFiltered: string[] = [];
  composicionJuridicaFilterList: string[] = [];
  composicionJuridicaFiltered: string[] = [];
  paisFilterList: string[] = [];
  paisFiltered: string[] = [];
  tipoDocumentoFilterList: string[] = [];
  tipoDocumentoFiltered: string[] = [];

  get isFilteredByCiudad(): boolean {
    return this.ciudadFiltered.length !== this.ciudadFilterList.length
  }

  get isFilteredByComposicionJuridica(): boolean {
    return this.composicionJuridicaFiltered.length !== this.composicionJuridicaFilterList.length
  }

  get isFilteredByPais(): boolean {
    return this.paisFiltered.length !== this.paisFilterList.length
  }

  get isFilteredByTipoDocumento(): boolean {
    return this.tipoDocumentoFiltered.length !== this.tipoDocumentoFilterList.length
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('ciudadCheckboxFilter') ciudadCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('composicionJuridicaCheckboxFilter') composicionJuridicaCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('paisCheckboxFilter') paisCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('tipoDocumentoCheckboxFilter') tipoDocumentoCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private remitenteService: RemitenteService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  redirectToCreate(): void {
    this.router.navigate(['/entities/remitente/create']);
  }

  redirectToEdit(event: TableEvent<RemitenteList>): void {
    this.router.navigate(['/entities/remitente/edit', event.row.id]);
  }

  redirectToShow(event: TableEvent<RemitenteList>): void {
    this.router.navigate(['/entities/remitente/show', event.row.id]);
  }

  deleteRow(event: TableEvent<RemitenteList>): void {
    const row = event.row;
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          message: "¿Está seguro que desea eliminar el Remitente ${row.nombre}?",
        },
      })
      .afterClosed()
      .pipe(filter((confirmed: boolean) => confirmed))
      .subscribe(() => {
        this.remitenteService.delete(row.id).subscribe(() => {
          this.snackbar.open('Eliminado satisfactoriamente', 'Ok')
            .afterDismissed()
            .subscribe(() => {
              this.getList();
            });
        });
      });
  }

  downloadFile(): void {
    this.remitenteService.generateReports().subscribe(filename => {
      this.reportsService.downloadFile(filename).subscribe(file => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: RemitenteList, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByComposicionJuridica = filter.composicion_juridica?.split('|').some(x => obj.composicion_juridica_nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByCiudad = filter.ciudad?.split('|').some(x => obj.ciudad_nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByPais = filter.pais?.split('|').some(x => obj.pais_nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByTipoDocumento = filter.tipo_documento?.split('|').some(x => obj.tipo_documento_descripcion.toLowerCase().indexOf(x) >= 0) ?? true;
    return filterByComposicionJuridica && filterByCiudad && filterByPais && filterByTipoDocumento;
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.ciudadFiltered = this.ciudadCheckboxFilter.getFilteredList();
    this.composicionJuridicaFiltered = this.composicionJuridicaCheckboxFilter.getFilteredList();
    this.paisFiltered = this.paisCheckboxFilter.getFilteredList();
    this.tipoDocumentoFiltered = this.tipoDocumentoCheckboxFilter.getFilteredList();
    if (this.isFilteredByCiudad) {
      filter.ciudad = this.ciudadFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByComposicionJuridica) {
      filter.composicion_juridica = this.composicionJuridicaFiltered.join('|');
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
    this.filter(this.isFiltered ? JSON.stringify(filter) : '', !this.isFiltered);
  }

  resetFilter(): void {
    this.resetFilterList();
    this.filter('');
  }

  private getList(): void {
    this.remitenteService.getList().subscribe(list => {
      this.list = list;
      this.ciudadFilterList = getFilterList(list, (x) => x.ciudad_nombre);
      this.composicionJuridicaFilterList = getFilterList(list, (x) => x.composicion_juridica_nombre);
      this.paisFilterList = getFilterList(list, (x) => x.pais_nombre);
      this.tipoDocumentoFilterList = getFilterList(list, (x) => x.tipo_documento_descripcion);
      this.resetFilterList();
    });
  }

  private filter(filter: string, isFilteredByGlobalSearch: boolean = true): void {
    this.searchService.search(filter, isFilteredByGlobalSearch);
    this.accordion.closeAll();
  }

  private resetFilterList(): void {
    this.isFiltered = false;
    this.ciudadFiltered = this.ciudadFilterList.slice();
    this.composicionJuridicaFiltered = this.composicionJuridicaFilterList.slice();
    this.paisFiltered = this.paisFilterList.slice();
    this.tipoDocumentoFiltered = this.tipoDocumentoFilterList.slice();
  }
}
