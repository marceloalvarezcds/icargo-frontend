import { Component, Input } from '@angular/core';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { TransactionalUser } from 'src/app/interfaces/transactional_user';

@Component({
  selector: 'app-punto-venta-form-transactional-users',
  templateUrl: './punto-venta-form-transactional-users.component.html',
  styleUrls: ['./punto-venta-form-transactional-users.component.scss'],
})
export class PuntoVentaFormTransactionalUsersComponent {
  a = PermisoAccionEnum;
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: TransactionalUser) => element.id,
      sticky: true,
    },
    {
      def: 'numero_documento',
      title: 'Número de documento',
      value: (element: TransactionalUser) => element.numero_documento,
    },
    {
      def: 'nombre',
      title: 'Nombre',
      value: (element: TransactionalUser) => element.nombre,
    },
    {
      def: 'apellido',
      title: 'Apellido',
      value: (element: TransactionalUser) => element.apellido,
    },
    {
      def: 'is_admin',
      title: 'Activo',
      value: (element: TransactionalUser) =>
        element.is_activated ? 'Si' : 'No',
    },
    {
      def: 'telefono',
      title: 'Teléfono',
      value: (element: TransactionalUser) => element.telefono,
    },
  ];
  @Input() list: TransactionalUser[] = [];
}
