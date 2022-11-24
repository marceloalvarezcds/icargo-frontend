import { EstadoEnum } from 'src/app/enums/estado-enum';
import { SeleccionableBaseModel } from './seleccionable';

export interface Cargo extends SeleccionableBaseModel {}

export const mockCargoList: Cargo[] = [
  {
    id: 1,
    descripcion: 'Gerente',
    estado: EstadoEnum.ACTIVO,
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
  {
    id: 2,
    descripcion: 'Vendedor',
    estado: EstadoEnum.ACTIVO,
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
];
