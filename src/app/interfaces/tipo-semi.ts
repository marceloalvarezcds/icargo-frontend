import { EstadoEnum } from '../enums/estado-enum';
import { TipoSemiEnum } from '../enums/tipo-semi-enum';

export interface TipoSemi {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoSemiList: TipoSemi[] = [
  {
    id: 1,
    descripcion: TipoSemiEnum.D1,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: TipoSemiEnum.D1_1D,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 3,
    descripcion: TipoSemiEnum.D1_2D,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 4,
    descripcion: TipoSemiEnum.D2,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 5,
    descripcion: TipoSemiEnum.D3,
    estado: EstadoEnum.ACTIVO,
  },
];
