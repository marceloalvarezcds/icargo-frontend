import { EstadoEnum } from '../enums/estado-enum';
import { TipoCamionEnum } from '../enums/tipo-camion-enum';

export interface TipoCamion {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoCamionList: TipoCamion[] = [
  {
    id: 1,
    descripcion: TipoCamionEnum.TRUCKY,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: TipoCamionEnum.CHASIS,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 3,
    descripcion: TipoCamionEnum.S1_2D,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 4,
    descripcion: TipoCamionEnum.S1_1S,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 5,
    descripcion: TipoCamionEnum.S1_1D,
    estado: EstadoEnum.ACTIVO,
  },
];
