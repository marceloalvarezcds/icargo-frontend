import { Component, OnInit } from '@angular/core';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Combinacion } from 'src/app/interfaces/combinacion';
@Component({
  selector: 'app-combinacion-list',
  templateUrl: './combinacion-list.component.html',
  styleUrls: ['./combinacion-list.component.scss']
})
export class CombinacionListComponent{
  modelo = m.COMBINACION
  columns: Column[] = [
    {
      def: 'id',
      title: 'N',
      value: (element: Combinacion) => element.id,
      sticky: true,
    }
  ]
  // constructor() { }

  // ngOnInit(): void {
  // }

}
