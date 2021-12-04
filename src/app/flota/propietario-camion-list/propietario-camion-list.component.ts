import { Component, Input } from '@angular/core';
import { CamionList } from 'src/app/interfaces/camion';
import { Column } from 'src/app/interfaces/column';
import { CamionService } from 'src/app/services/camion.service';

@Component({
  selector: 'app-propietario-camion-list',
  templateUrl: './propietario-camion-list.component.html',
  styleUrls: ['./propietario-camion-list.component.scss']
})
export class PropietarioCamionListComponent {

  columns: Column[] = [
    { def: 'placa', title: 'Placa', value: (element: CamionList) => element.placa, sticky: true },
    { def: 'estado', title: 'Estado', value: (element: CamionList) => element.estado },
    { def: 'pais_emisor_placa_nombre', title: 'País Emisor', value: (element: CamionList) => element.pais_emisor_placa_nombre },
    { def: 'tipo', title: 'Tipo de Camión', value: (element: CamionList) => element.tipo_descripcion },
    { def: 'chofer_nombre', title: 'Chofer', value: (element: CamionList) => element.chofer_nombre },
    { def: 'chofer_numero_documento', title: 'Documento Chofer', value: (element: CamionList) => element.chofer_numero_documento },
    { def: 'marca', title: 'Marca', value: (element: CamionList) => element.marca_descripcion },
  ];

  list: CamionList[] = [];

  @Input() isShow = false;
  @Input() set propietarioId(id: number | undefined) {
    if (id) {
      this.camionService.getListByPropietarioId(id).subscribe(list => {
        this.list = list;
      });
    }
  }

  constructor(private camionService: CamionService) { }
}
