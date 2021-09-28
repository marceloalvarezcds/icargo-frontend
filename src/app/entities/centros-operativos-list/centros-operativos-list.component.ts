import { Component, OnInit } from '@angular/core';
import { CentroOperativo } from 'src/app/interfaces/centro-operativo';
import { Column } from 'src/app/interfaces/column';
import { CentroOperativoService } from 'src/app/services/centro-operativo.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-centros-operativos-list',
  templateUrl: './centros-operativos-list.component.html',
  styleUrls: ['./centros-operativos-list.component.scss']
})
export class CentrosOperativosListComponent implements OnInit {

  columns: Column[] = [
    { def: 'nombre', title: 'Nombre', value: (element: CentroOperativo) => `${element.nombre}`, sticky: true },
    { def: 'tipo', title: 'Tipo', value: (element: CentroOperativo) => `${element.nombre_corto}` },
    { def: 'direccion', title: 'Dirección', value: (element: CentroOperativo) => `${element.direccion}` },
    { def: 'ciudad', title: 'Ciudad', value: (element: CentroOperativo) => `${element.ciudad}` },
    { def: 'localidad', title: 'Localidad', value: (element: CentroOperativo) => `${element.localidad}` },
    { def: 'pais', title: 'País', value: (element: CentroOperativo) => `${element.pais}` },
    { def: 'categoria', title: 'Clasificación', value: (element: CentroOperativo) => `${element.clasificacion}` },
    { def: 'moderado', title: 'Moderado', value: (element: CentroOperativo) => `${element.moderado}` },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  list: CentroOperativo[] = [];
  clasificacion: string[] = [];
  clasificacionFiltered: string[] = [];
  cuidades: string[] = [];
  cuidadesFiltered: string[] = [];
  paises: string[] = [];
  paisesFiltered: string[] = [];

  constructor(
    public searchService: SearchService,
    private centroOperativoService: CentroOperativoService,
  ) { }

  ngOnInit(): void {
    this.centroOperativoService.getList().subscribe(list => {
      this.list = list;
      this.clasificacion = list.map(x => x.clasificacion).filter((x, i, a) => a.indexOf(x) === i);
      this.cuidades = list.map(x => x.ciudad).filter((x, i, a) => a.indexOf(x) === i);
      this.paises = list.map(x => x.pais).filter((x, i, a) => a.indexOf(x) === i);
    });
  }

  downloadCSV(): void {}

  filterPredicate(obj: CentroOperativo, filter: string): boolean {
    return filter.split(' ').some(
      item => (
        obj.clasificacion.toLowerCase().indexOf(item) >= 0 ||
        obj.ciudad.toLowerCase().indexOf(item) >= 0 ||
        obj.pais.toLowerCase().indexOf(item) >= 0
      )
    );
  }
}
