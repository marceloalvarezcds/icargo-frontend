import { EstadoEnum } from '../enums/estado-enum';
import { TipoCargaEnum } from '../enums/tipo-carga-enum';

export interface TipoCarga {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoCargaList: TipoCarga[] = [
  {
    id: 1,
    descripcion: TipoCargaEnum.SECA,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: TipoCargaEnum.LIQUIDA,
    estado: EstadoEnum.ACTIVO,
  },
];
