import { Component, Input } from '@angular/core';
import { Column } from 'src/app/interfaces/column';
import { SemiList } from 'src/app/interfaces/semi';
import { SemiService } from 'src/app/services/semi.service';

@Component({
  selector: 'app-propietario-semi-list',
  templateUrl: './propietario-semi-list.component.html',
  styleUrls: ['./propietario-semi-list.component.scss']
})
export class PropietarioSemiListComponent {

  columns: Column[] = [
    { def: 'placa', title: 'Placa', value: (element: SemiList) => element.placa, sticky: true },
    { def: 'estado', title: 'Estado', value: (element: SemiList) => element.estado },
    { def: 'pais_emisor', title: 'País Emisor', value: (element: SemiList) => element.pais_emisor_placa_nombre },
    { def: 'tipo', title: 'Tipo de Semi', value: (element: SemiList) => element.tipo_descripcion },
    { def: 'clasificacion_descripcion', title: 'Clasificación', value: (element: SemiList) => element.clasificacion_descripcion },
    { def: 'tipo_carga_descripcion', title: 'Tipo de Carga', value: (element: SemiList) => element.tipo_carga_descripcion },
    { def: 'marca', title: 'Marca', value: (element: SemiList) => element.marca_descripcion },
  ];

  list: SemiList[] = [];

  @Input() isShow = false;
  @Input() set propietarioId(id: number | undefined) {
    if (id) {
      this.semiService.getListByPropietarioId(id).subscribe(list => {
        this.list = list;
      });
    }
  }

  constructor(private semiService: SemiService) { }
}
