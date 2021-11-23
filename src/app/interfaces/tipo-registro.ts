import { EstadoEnum } from '../enums/estado-enum';
import { TipoRegistroEnum } from '../enums/tipo-registro-enum';

export interface TipoRegistro {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoRegistroList: TipoRegistro[] = [
  {
    id: 1,
    descripcion: TipoRegistroEnum.A,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: TipoRegistroEnum.B,
    estado: EstadoEnum.ACTIVO,
  },
];
