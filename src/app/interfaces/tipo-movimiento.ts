import { EstadoEnum } from 'src/app/enums/estado-enum';
import { SeleccionableBaseModel } from './seleccionable';

export interface TipoMovimiento extends SeleccionableBaseModel {
  codigo: string;
  codigo_descripcion: string;
  cuenta_id: number;
  cuenta_codigo_descripcion: string;
  info: string;
}

export const mockTipoMovimientoList: TipoMovimiento[] = [
  {
    id: 1,
    descripcion: 'Anticipo',
    estado: EstadoEnum.ACTIVO,
    codigo: '01',
    codigo_descripcion: '01: Anticipo',
    cuenta_id: 1,
    cuenta_codigo_descripcion: 'Otro',
    info: 'Otro - Anticipo',
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
  {
    id: 2,
    descripcion: 'Complemento',
    estado: EstadoEnum.ACTIVO,
    codigo: '02',
    codigo_descripcion: '02: Complemento',
    cuenta_id: 1,
    cuenta_codigo_descripcion: 'Otro',
    info: 'Otro - Complemento',
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
  {
    id: 3,
    descripcion: 'Descuento',
    estado: EstadoEnum.ACTIVO,
    codigo: '03',
    codigo_descripcion: '03: Descuento',
    cuenta_id: 1,
    cuenta_codigo_descripcion: 'Otro',
    info: 'Otro - Descuento',
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
  {
    id: 4,
    descripcion: 'Merma',
    estado: EstadoEnum.ACTIVO,
    codigo: '04',
    codigo_descripcion: '04: Merma',
    cuenta_id: 1,
    cuenta_codigo_descripcion: 'Otro',
    info: 'Otro - Merma',
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
];
