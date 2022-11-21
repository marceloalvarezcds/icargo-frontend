import { EstadoEnum } from 'src/app/enums/estado-enum';
import { SeleccionableBaseModel } from './seleccionable';

export interface TipoCuenta extends SeleccionableBaseModel {
  codigo: string;
  codigo_descripcion: string;
}

export const mockTipoCuentaList: TipoCuenta[] = [
  {
    id: 1,
    codigo: '001',
    codigo_descripcion: '001: Viajes',
    descripcion: 'Viajes',
    estado: EstadoEnum.ACTIVO,
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
  {
    id: 2,
    codigo: '002',
    codigo_descripcion: '002: Otros',
    descripcion: 'Otros',
    estado: EstadoEnum.ACTIVO,
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
];
