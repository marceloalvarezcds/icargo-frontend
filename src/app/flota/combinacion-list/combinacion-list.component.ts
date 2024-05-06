import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as saveAs from 'file-saver';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Combinacion } from 'src/app/interfaces/combinacion';
import { CombinacionService } from 'src/app/services/combinacion.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
@Component({
  selector: 'app-combinacion-list',
  templateUrl: './combinacion-list.component.html',
  styleUrls: ['./combinacion-list.component.scss']
})
export class CombinacionListComponent{
  modelo = m.COMBINACION;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: Combinacion) => element.id,
      sticky: true,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: Combinacion) => element.estado,
    },
    {
      def: 'camion',
      title: 'Tracto',
      value: (element: Combinacion) => element.camion.placa,
    },
    {
      def: 'marca_camion',
      title: 'Marca',
      value: (element: Combinacion) => element.camion.marca,
    },
    {
      def: 'camion_neto',
      title: 'Neto',
      value: (element: Combinacion) => element.camion_neto.neto,
    },
    {
      def: 'producto',
      title: 'Producto',
      value: (element: Combinacion) => element.producto.descripcion,
    },
    {
      def: 'semi',
      title: 'Semi',
      value: (element: Combinacion) => element.semi.placa,
    },
    {
      def: 'marca_semi',
      title: 'Marca',
      value: (element: Combinacion) => element.semi.marca,
    },
    {
      def: 'chofer',
      title: 'Chofer',
      value: (element: Combinacion) => element.chofer.nombre,
    },
    {
      def: 'propietario',
      title: 'Propietario',
      value: (element: Combinacion) => element.propietario.nombre,
    },
    {
      def: 'usuario',
      title: 'Usuario',
      value: (element: Combinacion) => element.usuario.username,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: Combinacion) => element.modified_at,
      type: 'date',
    },
    // Otros campos y columnas...
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: Combinacion[] = [];
  // Otros campos y propiedades...

  get isFilteredByEstado(): boolean {
    // Lógica para determinar si se ha filtrado por estado
    return false; // Cambiar por la lógica correcta
  }

  // Otros getters isFilteredByX según los filtros que tengas...

  
  // Otros ViewChild según los filtros que tengas...

  constructor(
    private combinacionService: CombinacionService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  redirectToCreate(): void {
    this.router.navigate([`/flota/${m.COMBINACION}/${a.CREAR}`]);
  }

  // Métodos redirectToEdit, redirectToShow, deleteRow, downloadFile, filterPredicate, applyFilter, resetFilter...

  private getList(): void {
    this.combinacionService.getList().subscribe((list) => {
      this.list = list;
      // Lógica para obtener las listas de filtros
      // Ejemplo:
      // this.estadoFilterList = getFilterList(list, (x) => x.estado);
      this.resetFilterList();
    });
  }

  private resetFilterList(): void {
    this.isFiltered = false;
    // Lógica para reiniciar las listas de filtros
    // Ejemplo:
    // this.estadoFiltered = this.estadoFilterList.slice();
  }


  downloadFile(): void {
    this.combinacionService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }



  applyFilter(): void {
    // Implement the logic to apply filters here
  }

  resetFilter(): void {
    // Implement the logic to reset filters here
  }


}

