import { EstadoEnum } from 'src/app/enums/estado-enum';
import { TipoSemiEnum } from 'src/app/enums/tipo-semi-enum';

export interface TipoSemi {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
  tipo_imagen: string | null;
}

export const mockTipoSemiList: TipoSemi[] = [
  {
    id: 1,
    descripcion: TipoSemiEnum.D1,
    estado: EstadoEnum.ACTIVO,
    tipo_imagen: null,
  },
  {
    id: 2,
    descripcion: TipoSemiEnum.D1_1D,
    estado: EstadoEnum.ACTIVO,
    tipo_imagen: null,
  },
  {
    id: 3,
    descripcion: TipoSemiEnum.D1_2D,
    estado: EstadoEnum.ACTIVO,
    tipo_imagen: null,
  },
  {
    id: 4,
    descripcion: TipoSemiEnum.D2,
    estado: EstadoEnum.ACTIVO,
    tipo_imagen: null,
  },
  {
    id: 5,
    descripcion: TipoSemiEnum.D3,
    estado: EstadoEnum.ACTIVO,
    tipo_imagen: null,
  },
];
