import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Caja } from 'src/app/interfaces/caja';
import { Column } from 'src/app/interfaces/column';
import { TableEvent } from 'src/app/interfaces/table';
import { CajaService } from 'src/app/services/caja.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  estado?: string;
  moneda?: string;
};

@Component({
  selector: 'app-caja-list',
  templateUrl: './caja-list.component.html',
  styleUrls: ['./caja-list.component.scss'],
})
export class CajaListComponent implements OnInit {
  modelo = m.CAJA;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: Caja) => element.id,

    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: Caja) => element.estado.toUpperCase(),

    },
    {
      def: 'nombre',
      title: 'Caja',
      value: (element: Caja) => element.nombre,
    },
    {
      def: 'moneda_nombre',
      title: 'Moneda',
      value: (element: Caja) => element.moneda_nombre,
    },
    {
      def: 'credito_caja',
      title: 'Crédito',
      value: (element: Caja) => element.credito,
      type: 'number',
    },
    {
      def: 'debito_caja',
      title: 'Débito',
      value: (element: Caja) => element.debito,
      type: 'number',
    },
    {
      def: 'saldo_caja',
      title: 'Saldo',
      value: (element: Caja) => element.saldo_confirmado,
      type: 'number',
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: Caja) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: Caja) => this.formatDate(element.created_at),
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: Caja) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: Caja) => this.formatDate(element.modified_at),
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: Caja[] = [];
  estadoFilterList: string[] = [];
  estadoFiltered: string[] = [];
  monedaFilterList: string[] = [];
  monedaFiltered: string[] = [];

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }


  get isFilteredByEstado(): boolean {
    return this.estadoFiltered.length !== this.estadoFilterList.length;
  }

  get isFilteredByProducto(): boolean {
    return this.monedaFiltered.length !== this.monedaFilterList.length;
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('estadoCheckboxFilter')
  estadoCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('monedaCheckboxFilter')
  monedaCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private cajaService: CajaService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  redirectToCreate(): void {
     this.router.navigate([`/caja/${m.CAJA}/${a.CREAR}`]);
   }

   redirectToEdit(event: TableEvent<Caja>): void {
     this.router.navigate([`/caja/${m.CAJA}/${a.EDITAR}`, event.row.id]);
   }

   redirectToShow(event: TableEvent<Caja>): void {
     this.router.navigate([`/caja/${m.CAJA}/${a.VER}`, event.row.id]);
   }

  // redirectToCreate(): void {
  //   const url = `/caja/${m.CAJA}/${a.CREAR}`;
  //   window.open(url, '_blank');
  // }

  // redirectToEdit(event: TableEvent<Caja>): void {
  //   const url = `/caja/${m.CAJA}/${a.EDITAR}/${event.row.id}`;
  //   window.open(url, '_blank');
  // }

  // redirectToShow(event: TableEvent<Caja>): void {
  //   const url = `/caja/${m.CAJA}/${a.VER}/${event.row.id}`;
  //   window.open(url, '_blank');
  // }

  redirectToShowMovimientos(event: TableEvent<Caja>): void {
    const url = `/caja/${m.CAJA}/${m.MOVIMIENTO}/${a.LISTAR}/${event.row.id}`;
    window.open(url, '_blank');
  }

  deleteRow({ row }: TableEvent<Caja>): void {
    const message = `¿Está seguro que desea eliminar la caja ${row.nombre}?`;
    this.dialog.confirmationToDelete(
      message,
      this.cajaService.delete(row.id),
      () => {
        this.getList();
      }
    );
  }

  downloadFile(): void {
    this.cajaService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: Caja, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByEstado =
      filter.estado
        ?.split('|')
        .some((x) => obj.estado.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByProducto =
      filter.moneda
        ?.split('|')
        .some((x) => obj.moneda_nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    return filterByEstado && filterByProducto;
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.estadoFiltered = this.estadoCheckboxFilter.getFilteredList();
    this.monedaFiltered = this.monedaCheckboxFilter.getFilteredList();
    if (this.isFilteredByEstado) {
      filter.estado = this.estadoFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByProducto) {
      filter.moneda = this.monedaFiltered.join('|');
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
    this.cajaService.getListByGestorCarga().subscribe((list) => {
      this.list = list;
      this.estadoFilterList = getFilterList(list, (x) => x.estado);
      this.monedaFilterList = getFilterList(list, (x) => x.moneda_nombre);
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
    this.estadoFiltered = this.estadoFilterList.slice();
    this.monedaFiltered = this.monedaFilterList.slice();
  }
}
