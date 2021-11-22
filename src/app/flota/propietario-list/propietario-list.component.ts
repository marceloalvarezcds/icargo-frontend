import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { PermisoAccionEnum as a, PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { PropietarioList } from 'src/app/interfaces/propietario';
import { TableEvent } from 'src/app/interfaces/table';
import { PropietarioService } from 'src/app/services/propietario.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  ciudad?: string;
  pais?: string;
  tipo_persona?: string;
}

@Component({
  selector: 'app-propietario-list',
  templateUrl: './propietario-list.component.html',
  styleUrls: ['./propietario-list.component.scss']
})
export class PropietarioListComponent implements OnInit {

  modelo = m.PROPIETARIO;
  columns: Column[] = [
    { def: 'nombre', title: 'Nombre o Razón Social', value: (element: PropietarioList) => element.nombre, sticky: true },
    { def: 'tipo_persona', title: 'Tipo de Persona', value: (element: PropietarioList) => element.tipo_persona_descripcion },
    { def: 'ruc', title: 'Número de Documento', value: (element: PropietarioList) => element.ruc },
    { def: 'gestor_cuenta_nombre', title: 'Gestor de Cuenta', value: (element: PropietarioList) => element.gestor_cuenta_nombre },
    { def: 'oficial_cuenta_nombre', title: 'Oficial de Cuenta', value: (element: PropietarioList) => element.oficial_cuenta_nombre },
    { def: 'direccion', title: 'Dirección', value: (element: PropietarioList) => element.direccion },
    { def: 'ubicacion', title: 'Ubicación', value: (element: PropietarioList) => `${element.ciudad_nombre}/${element.localidad_nombre}/${element.pais_nombre_corto}` },
    { def: 'estado', title: 'Estado', value: (element: PropietarioList) => element.estado },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: PropietarioList[] = [];
  ciudadFilterList: string[] = [];
  ciudadFiltered: string[] = [];
  paisFilterList: string[] = [];
  paisFiltered: string[] = [];
  tipoPersonaFilterList: string[] = [];
  tipoPersonaFiltered: string[] = [];

  get isFilteredByCiudad(): boolean {
    return this.ciudadFiltered.length !== this.ciudadFilterList.length
  }

  get isFilteredByPais(): boolean {
    return this.paisFiltered.length !== this.paisFilterList.length
  }

  get isFilteredByTipoPersona(): boolean {
    return this.tipoPersonaFiltered.length !== this.tipoPersonaFilterList.length
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('ciudadCheckboxFilter') ciudadCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('paisCheckboxFilter') paisCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('tipoPersonaCheckboxFilter') tipoPersonaCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private propietarioService: PropietarioService,
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
    this.router.navigate([`/flota/${m.PROPIETARIO}/${a.CREAR}`]);
  }

  redirectToEdit(event: TableEvent<PropietarioList>): void {
    this.router.navigate([`/flota/${m.PROPIETARIO}/${a.EDITAR}`, event.row.id]);
  }

  redirectToShow(event: TableEvent<PropietarioList>): void {
    this.router.navigate([`/flota/${m.PROPIETARIO}/${a.VER}`, event.row.id]);
  }

  deleteRow(event: TableEvent<PropietarioList>): void {
    const row = event.row;
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          message: `¿Está seguro que desea eliminar el Propietario ${row.nombre}`,
        },
      })
      .afterClosed()
      .pipe(filter((confirmed: boolean) => confirmed))
      .subscribe(() => {
        this.propietarioService.delete(row.id).subscribe(() => {
          this.snackbar.open('Eliminado satisfactoriamente', 'Ok')
            .afterDismissed()
            .subscribe(() => {
              this.getList();
            });
        });
      });
  }

  downloadFile(): void {
    this.propietarioService.generateReports().subscribe(filename => {
      this.reportsService.downloadFile(filename).subscribe(file => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: PropietarioList, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByCiudad = filter.ciudad?.split('|').some(x => obj.ciudad_nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByPais = filter.pais?.split('|').some(x => obj.pais_nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByTipoPersona = filter.tipo_persona?.split('|').some(x => obj.tipo_persona_descripcion.toLowerCase().indexOf(x) >= 0) ?? true;
    return filterByCiudad && filterByPais && filterByTipoPersona;
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.ciudadFiltered = this.ciudadCheckboxFilter.getFilteredList();
    this.paisFiltered = this.paisCheckboxFilter.getFilteredList();
    this.tipoPersonaFiltered = this.tipoPersonaCheckboxFilter.getFilteredList();
    if (this.isFilteredByCiudad) {
      filter.ciudad = this.ciudadFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByPais) {
      filter.pais = this.paisFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByTipoPersona) {
      filter.tipo_persona = this.tipoPersonaFiltered.join('|');
      this.isFiltered = true;
    }
    this.filter(this.isFiltered ? JSON.stringify(filter) : '', !this.isFiltered);
  }

  resetFilter(): void {
    this.resetFilterList();
    this.filter('');
  }

  private getList(): void {
    this.propietarioService.getList().subscribe(list => {
      this.list = list;
      this.ciudadFilterList = getFilterList(list, (x) => x.ciudad_nombre);
      this.paisFilterList = getFilterList(list, (x) => x.pais_nombre);
      this.tipoPersonaFilterList = getFilterList(list, (x) => x.tipo_persona_descripcion);
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
    this.paisFiltered = this.paisFilterList.slice();
    this.tipoPersonaFiltered = this.tipoPersonaFilterList.slice();
  }
}
