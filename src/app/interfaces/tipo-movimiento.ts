import { EstadoEnum } from 'src/app/enums/estado-enum';
import { SeleccionableBaseModel } from './seleccionable';

export interface TipoMovimiento extends SeleccionableBaseModel {
  cuenta_id: number;
  cuenta_descripcion: string;
}

export const mockTipoMovimientoList: TipoMovimiento[] = [
  {
    id: 1,
    descripcion: 'Anticipo',
    estado: EstadoEnum.ACTIVO,
    cuenta_id: 1,
    cuenta_descripcion: 'Otro',
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
  {
    id: 2,
    descripcion: 'Complemento',
    estado: EstadoEnum.ACTIVO,
    cuenta_id: 1,
    cuenta_descripcion: 'Otro',
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
  {
    id: 3,
    descripcion: 'Descuento',
    estado: EstadoEnum.ACTIVO,
    cuenta_id: 1,
    cuenta_descripcion: 'Otro',
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
  {
    id: 4,
    descripcion: 'Merma',
    estado: EstadoEnum.ACTIVO,
    cuenta_id: 1,
    cuenta_descripcion: 'Otro',
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
];
