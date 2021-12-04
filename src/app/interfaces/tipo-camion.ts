import { EstadoEnum } from 'src/app/enums/estado-enum';
import { TipoCamionEnum } from 'src/app/enums/tipo-camion-enum';

export interface TipoCamion {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
  tipo_imagen: string | null;
}

export const mockTipoCamionList: TipoCamion[] = [
  {
    id: 1,
    descripcion: TipoCamionEnum.TRUCKY,
    estado: EstadoEnum.ACTIVO,
    tipo_imagen: null,
  },
  {
    id: 2,
    descripcion: TipoCamionEnum.CHASIS,
    estado: EstadoEnum.ACTIVO,
    tipo_imagen: null,
  },
  {
    id: 3,
    descripcion: TipoCamionEnum.S1_2D,
    estado: EstadoEnum.ACTIVO,
    tipo_imagen: null,
  },
  {
    id: 4,
    descripcion: TipoCamionEnum.S1_1S,
    estado: EstadoEnum.ACTIVO,
    tipo_imagen: null,
  },
  {
    id: 5,
    descripcion: TipoCamionEnum.S1_1D,
    estado: EstadoEnum.ACTIVO,
    tipo_imagen: null,
  },
];
