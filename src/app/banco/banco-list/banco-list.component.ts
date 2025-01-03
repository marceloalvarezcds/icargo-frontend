import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Banco } from 'src/app/interfaces/banco';
import { Column } from 'src/app/interfaces/column';
import { TableEvent } from 'src/app/interfaces/table';
import { BancoService } from 'src/app/services/banco.service';
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
  selector: 'app-banco-list',
  templateUrl: './banco-list.component.html',
  styleUrls: ['./banco-list.component.scss'],
})
export class BancoListComponent implements OnInit {
  modelo = m.BANCO;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: Banco) => element.id,

    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: Banco) => element.estado.toUpperCase(),

    },
    {
      def: 'nombre',
      title: 'Banco',
      value: (element: Banco) => element.nombre,
    },
    {
      def: 'moneda_nombre',
      title: 'Moneda',
      value: (element: Banco) => element.moneda_nombre,
    },
    {
      def: 'numero_cuenta',
      title: 'Nº de Cuenta',
      value: (element: Banco) => element.numero_cuenta,
    },
    {
      def: 'titular',
      title: 'Titular',
      value: (element: Banco) => element.titular,
    },
    {
      def: 'credito_banco',
      title: 'Crédito',
      value: (element: Banco) => element.credito,
      type: 'number',
    },
    {
      def: 'debito_banco',
      title: 'Débito',
      value: (element: Banco) => element.debito,
      type: 'number',
    },
    {
      def: 'saldo_banco',
      title: 'Saldo',
      value: (element: Banco) => element.saldo_confirmado,
      type: 'number',
    },
    {
      def: 'saldo_provisional',
      title: 'Pendiente',
      value: (element: Banco) => element.saldo_provisional,
      type: 'number',
    },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: Banco) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha',
      value: (element: Banco) => this.formatDate(element.created_at),
    },
    // {
    //   def: 'modified_by',
    //   title: 'Usuario modificación',
    //   value: (element: Banco) => element.modified_by,
    // },
    // {
    //   def: 'modified_at',
    //   title: 'Fecha modificación',
    //   value: (element: Banco) => this.formatDate(element.modified_at),
    // },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: Banco[] = [];
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
    private bancoService: BancoService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  // redirectToCreate(): void {
  //   this.router.navigate([`/banco/${m.BANCO}/${a.CREAR}`]);
  // }

  // redirectToEdit(event: TableEvent<Banco>): void {
  //   this.router.navigate([`/banco/${m.BANCO}/${a.EDITAR}`, event.row.id]);
  // }

  // redirectToShow(event: TableEvent<Banco>): void {
  //   this.router.navigate([`/banco/${m.BANCO}/${a.VER}`, event.row.id]);
  // }

  redirectToCreate(): void {
    const url = `/banco/${m.BANCO}/${a.CREAR}`;
    window.open(url, '_blank');
  }

  redirectToEdit(event: TableEvent<Banco>): void {
    const url = `/banco/${m.BANCO}/${a.EDITAR}/${event.row.id}`;
    window.open(url, '_blank');
  }

  redirectToShow(event: TableEvent<Banco>): void {
    const url = `/banco/${m.BANCO}/${a.VER}/${event.row.id}`;
    window.open(url, '_blank');
  }

  redirectToShowMovimientos(event: TableEvent<Banco>): void {
    const url = `/banco/${m.BANCO}/${m.MOVIMIENTO}/${a.LISTAR}/${event.row.id}`;
    window.open(url, '_blank');
  }

  deleteRow({ row }: TableEvent<Banco>): void {
    const message = `¿Está seguro que desea eliminar la banco ${row.numero_cuenta}?`;
    this.dialog.confirmationToDelete(
      message,
      this.bancoService.delete(row.id),
      (_) => {
        this.getList();
      }
    );
  }

  downloadFile(): void {
    this.bancoService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: Banco, filterJson: string): boolean {
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
    this.bancoService.getListByGestorCarga().subscribe((list) => {
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
