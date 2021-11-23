import { Component, Input } from '@angular/core';
import { Column } from 'src/app/interfaces/column';
import { SemirremolqueList } from 'src/app/interfaces/semirremolque';
import { SemirremolqueService } from 'src/app/services/semirremolque.service';

@Component({
  selector: 'app-propietario-semi-list',
  templateUrl: './propietario-semi-list.component.html',
  styleUrls: ['./propietario-semi-list.component.scss']
})
export class PropietarioSemiListComponent {

  columns: Column[] = [
    { def: 'placa', title: 'Placa', value: (element: SemirremolqueList) => element.placa, sticky: true },
    { def: 'estado', title: 'Estado', value: (element: SemirremolqueList) => element.estado },
    { def: 'pais_emisor', title: 'País Emisor', value: (element: SemirremolqueList) => element.pais_emisor_nombre },
    { def: 'tipo_camion', title: 'Tipo de Camión', value: (element: SemirremolqueList) => element.tipo_camion_descripcion },
    { def: 'clasificacion_descripcion', title: 'Clasificación', value: (element: SemirremolqueList) => element.clasificacion_descripcion },
    { def: 'tipo_semi_descripcion', title: 'Tipo de Semi', value: (element: SemirremolqueList) => element.tipo_semi_descripcion },
    { def: 'marca', title: 'Marca', value: (element: SemirremolqueList) => element.marca_descripcion },
  ];

  list: SemirremolqueList[] = [];

  @Input() isShow = false;
  @Input() set propietarioId(id: number | undefined) {
    if (id) {
      this.semirremolqueService.getListByPropietarioId(id).subscribe(list => {
        this.list = list;
      });
    }
  }

  constructor(private semirremolqueService: SemirremolqueService) { }
}
