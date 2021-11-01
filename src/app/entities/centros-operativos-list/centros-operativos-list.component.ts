import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { CentroOperativoList } from 'src/app/interfaces/centro-operativo';
import { Column } from 'src/app/interfaces/column';
import { TableEvent } from 'src/app/interfaces/table';
import { CentroOperativoService } from 'src/app/services/centro-operativo.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  clasificacion?: string;
  ciudad?: string;
  pais?: string;
}

@Component({
  selector: 'app-centros-operativos-list',
  templateUrl: './centros-operativos-list.component.html',
  styleUrls: ['./centros-operativos-list.component.scss']
})
export class CentrosOperativosListComponent implements OnInit {

  columns: Column[] = [
    { def: 'nombre', title: 'Nombre', value: (element: CentroOperativoList) => element.nombre, sticky: true },
    { def: 'nombre_corto', title: 'Nombre Corto', value: (element: CentroOperativoList) => element.nombre_corto },
    { def: 'direccion', title: 'Dirección', value: (element: CentroOperativoList) => element.direccion },
    { def: 'ubicacion', title: 'Ubicación', value: (element: CentroOperativoList) => `${element.ciudad_nombre}/${element.localidad_nombre}/${element.pais_nombre_corto}` },
    { def: 'categoria', title: 'Clasificación', value: (element: CentroOperativoList) => element.clasificacion_nombre },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: CentroOperativoList[] = [];
  clasificacionFilterList: string[] = [];
  clasificacionFiltered: string[] = [];
  ciudadFilterList: string[] = [];
  ciudadFiltered: string[] = [];
  paisFilterList: string[] = [];
  paisFiltered: string[] = [];

  get isFilteredByClasificacion(): boolean {
    return this.clasificacionFiltered.length !== this.clasificacionFilterList.length
  }

  get isFilteredByCiudad(): boolean {
    return this.ciudadFiltered.length !== this.ciudadFilterList.length
  }

  get isFilteredByPais(): boolean {
    return this.paisFiltered.length !== this.paisFilterList.length
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('clasificacionCheckboxFilter') clasificacionCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('ciudadCheckboxFilter') ciudadCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('paisCheckboxFilter') paisCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private centroOperativoService: CentroOperativoService,
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
    this.router.navigate(['/entities/centros-operativos/create']);
  }

  redirectToEdit(event: TableEvent<CentroOperativoList>): void {
    this.router.navigate(['/entities/centros-operativos/edit', event.row.id]);
  }

  redirectToShow(event: TableEvent<CentroOperativoList>): void {
    this.router.navigate(['/entities/centros-operativos/show', event.row.id]);
  }

  deleteRow(event: TableEvent<CentroOperativoList>): void {
    const row = event.row;
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          message: `¿Está seguro que desea eliminar el Centro Operativo
          ${row.nombre}?`,
        },
      })
      .afterClosed()
      .pipe(filter((confirmed: boolean) => confirmed))
      .subscribe(() => {
        this.centroOperativoService.delete(row.id).subscribe(() => {
          this.snackbar.open('Eliminado satisfactoriamente', 'Ok')
            .afterDismissed()
            .subscribe(() => {
              this.getList();
            });
        });
      });
  }

  downloadFile(): void {
    this.centroOperativoService.generateReports().subscribe(filename => {
      this.reportsService.downloadFile(filename).subscribe(file => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: CentroOperativoList, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByClasificacion = filter.clasificacion?.split('|').some(x => obj.clasificacion_nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByCiudad = filter.ciudad?.split('|').some(x => obj.ciudad_nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByPais = filter.pais?.split('|').some(x => obj.pais_nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    return filterByClasificacion && filterByCiudad && filterByPais;
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.clasificacionFiltered = this.clasificacionCheckboxFilter.getFilteredList();
    this.ciudadFiltered = this.ciudadCheckboxFilter.getFilteredList();
    this.paisFiltered = this.paisCheckboxFilter.getFilteredList();
    if (this.isFilteredByClasificacion) {
      filter.clasificacion = this.clasificacionFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByCiudad) {
      filter.ciudad = this.ciudadFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByPais) {
      filter.pais = this.paisFiltered.join('|');
      this.isFiltered = true;
    }
    this.filter(this.isFiltered ? JSON.stringify(filter) : '', !this.isFiltered);
  }

  resetFilter(): void {
    this.resetFilterList();
    this.filter('');
  }

  private getList(): void {
    this.centroOperativoService.getList().subscribe(list => {
      this.list = list;
      this.clasificacionFilterList = getFilterList(list, (x) => x.clasificacion_nombre);
      this.ciudadFilterList = getFilterList(list, (x) => x.ciudad_nombre);
      this.paisFilterList = getFilterList(list, (x) => x.pais_nombre);
      this.resetFilterList();
    });
  }

  private filter(filter: string, isFilteredByGlobalSearch: boolean = true): void {
    this.searchService.search(filter, isFilteredByGlobalSearch);
    this.accordion.closeAll();
  }

  private resetFilterList(): void {
    this.isFiltered = false;
    this.clasificacionFiltered = this.clasificacionFilterList.slice();
    this.ciudadFiltered = this.ciudadFilterList.slice();
    this.paisFiltered = this.paisFilterList.slice();
  }
}
