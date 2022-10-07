import { EstadoEnum } from 'src/app/enums/estado-enum';
import { TipoCargaEnum } from 'src/app/enums/tipo-carga-enum';
import { SeleccionableBaseModel } from './seleccionable';

export interface TipoCarga extends SeleccionableBaseModel {}

export const mockTipoCargaList: TipoCarga[] = [
  {
    id: 1,
    descripcion: TipoCargaEnum.SECA,
    estado: EstadoEnum.ACTIVO,
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
  {
    id: 2,
    descripcion: TipoCargaEnum.LIQUIDA,
    estado: EstadoEnum.ACTIVO,
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
];
