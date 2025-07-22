import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';

import { Column } from 'src/app/interfaces/column';
import { OrdenCargaEvaluacionesHistorial } from 'src/app/interfaces/orden_carga_evaluacion';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { OrdenCargaEvaluacionesService } from 'src/app/services/orden-carga-evaluaciones.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  camion?: string;
  semi?: string;
  chofer?: string;
  propietario?: string;
};

@Component({
  selector: 'app-evaluacion-list',
  templateUrl: './evaluacion-list.component.html',
  styleUrls: ['./evaluacion-list.component.scss']
})
export class EvaluacionListComponent implements OnInit {
  modelo = m.ORDEN_CARGA_EVALUACION;

    columns: Column[] = [
      {
        def: 'orden_carga_id',
        title: 'OC Nº',
        value: (element: OrdenCargaEvaluacionesHistorial) => element.orden_carga_id,
        sticky: true,
      },
      {
        def: 'oc_camion_placa',
        title: 'Tracto',
        value: (element: OrdenCargaEvaluacionesHistorial) => element.oc_camion_placa,
      },

      {
        def: 'promedio_tracto_general',
        title: 'Prom. General Tracto',
        value: (element: OrdenCargaEvaluacionesHistorial) => element.promedio_tracto_general,
      },

          {
        def: 'chofer',
        title: 'Chofer',
        value: (element: OrdenCargaEvaluacionesHistorial) => element.oc_chofer_nombre,
      },


          {
        def: 'promedio_chofer_general',
        title: 'Chofer',
        value: (element: OrdenCargaEvaluacionesHistorial) => element.promedio_chofer_general,
      },

      {
        def: 'oc_beneficiario_nombre',
        title: 'Propietario',
        value: (element: OrdenCargaEvaluacionesHistorial) => element.oc_beneficiario_nombre,
      },
      // {
      //   def: 'promedio_propietario_gestor',
      //   title: 'Prom. Gestor',
      //   value: (element: OrdenCargaEvaluacionesHistorial) => element.promedio_propietario_gestor,

      // },
      {
        def: 'promedio_propietario_general',
        title: 'Prom. General Propietario',
        value: (element: OrdenCargaEvaluacionesHistorial) => element.promedio_propietario_general,
      },
      // {
      //   def: 'oc_origen_nombre',
      //   title: 'Origen',
      //   value: (element: OrdenCargaEvaluacionesHistorial) => element.oc_origen_nombre,
      // },
      // {
      //   def: 'oc_destino_nombre',
      //   title: 'Destino',
      //   value: (element: OrdenCargaEvaluacionesHistorial) => element.oc_destino_nombre,
      // },


      { def: 'actions', title: 'Acciones', stickyEnd: true },
    ];

  isFiltered = false;
  list: OrdenCargaEvaluacionesHistorial[] = [];
  camionFilterList: string[] = [];
  camionFiltered: string[] = [];
  semiFilterList: string[] = [];
  semiFiltered: string[] = [];
  choferFilterList: string[] = [];
  choferFiltered: string[] = [];
  propietarioFilterList: string[] = [];
  propietarioFiltered: string[] = [];

  get isFilteredByCamion(): boolean {
    return this.camionFiltered.length !== this.camionFilterList.length;
  }

  get isFilteredBySemi(): boolean {
    return this.semiFiltered.length !== this.semiFilterList.length;
  }

  get isFilteredByChofer(): boolean {
    return this.choferFiltered.length !== this.choferFilterList.length;
  }

  get isFilteredByPropietario(): boolean {
    return this.propietarioFiltered.length !== this.propietarioFilterList.length;
  }


  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('camionCheckboxFilter')
  camionCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('semiCheckboxFilter')
  semiCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('choferCheckboxFilter')
  choferCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('propietarioCheckboxFilter')
  propietarioCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private evaluacionService: OrdenCargaEvaluacionesService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: DialogService,
    private router: Router) { }


  ngOnInit(): void {
     this.getList();
   }

  redirectToShow(event: TableEvent<OrdenCargaEvaluacionesHistorial>): void {
    this.router.navigate([
      `/orden_carga_evaluacion/${m.ORDEN_CARGA_EVALUACION}/${a.VER}`,
      event.row.id,
    ]);
  }
  //  }


  //  downloadFile(): void {
  //    this.camionService.generateReports().subscribe((filename) => {
  //      this.reportsService.downloadFile(filename).subscribe((file) => {
  //        saveAs(file, filename);
  //      });
  //    });
  //  }

   filterPredicate(obj: OrdenCargaEvaluacionesHistorial, filterJson: string): boolean {
     const filter: Filter = JSON.parse(filterJson);
     const filterByCamion =
       filter.camion
         ?.split('|')
         .some((x) => obj.oc_camion_placa ? obj.oc_camion_placa.toLowerCase().indexOf(x) >= 0 : false) ?? true;
         // .some((x) => obj.marca_descripcion.toLowerCase().indexOf(x) >= 0) ??
       true;

    const filterBySemi =
      filter.semi
        ?.split('|')
        .some((x) => obj.oc_semi_placa ? obj.oc_semi_placa.toLowerCase().indexOf(x) >= 0 : false) ?? true;
        // .some((x) => obj.marca_descripcion.toLowerCase().indexOf(x) >= 0) ??
      true;
      const filterByChofer =
      filter.chofer
        ?.split('|')
        .some((x) => obj.oc_chofer_nombre ? obj.oc_chofer_nombre.toLowerCase().indexOf(x) >= 0 : false) ?? true;
        // .some((x) => obj.marca_descripcion.toLowerCase().indexOf(x) >= 0) ??
      true;
      const filterByPropietario =
      filter.propietario
        ?.split('|')
        .some((x) => obj.oc_beneficiario_nombre ? obj.oc_beneficiario_nombre.toLowerCase().indexOf(x) >= 0 : false) ?? true;
        // .some((x) => obj.marca_descripcion.toLowerCase().indexOf(x) >= 0) ??
      true;

     return filterByCamion && filterBySemi && filterByChofer && filterByPropietario
   }

   applyFilter(): void {
     let filter: Filter = {};
     this.isFiltered = false;
     this.camionFiltered = this.camionCheckboxFilter.getFilteredList();
     this.semiFiltered = this.semiCheckboxFilter.getFilteredList();
     this.choferFiltered = this.choferCheckboxFilter.getFilteredList();
     this.propietarioFiltered = this.propietarioCheckboxFilter.getFilteredList();

     if (this.isFilteredByCamion) {
       filter.camion = this.camionFiltered.join('|');
       this.isFiltered = true;
     }
     if (this.isFilteredBySemi) {
      filter.semi = this.semiFiltered.join('|');
      this.isFiltered = true;
    }

    if (this.isFilteredByChofer) {
      filter.chofer = this.choferFiltered.join('|');
      this.isFiltered = true;
    }


    if (this.isFilteredByPropietario) {
      filter.propietario = this.propietarioFiltered.join('|');
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
     this.evaluacionService.getList().subscribe((list) => {
       this.list = list;
       this.camionFilterList = getFilterList(list, (x) => x.oc_camion_placa);
       this.semiFilterList = getFilterList(list, (x) => x.oc_semi_placa);
       this.choferFilterList = getFilterList(list, (x) => x.oc_chofer_nombre);
       this.propietarioFilterList = getFilterList(list, (x) => x.oc_beneficiario_nombre);

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
     this.camionFiltered = this.camionFilterList.slice();
     this.semiFiltered = this.semiFilterList.slice();
     this.choferFiltered = this.choferFilterList.slice();
     this.choferFiltered = this.choferFilterList.slice();

   }
}
