import { EstadoEnum } from '../enums/estado-enum';
import { TipoPersonaEnum } from '../enums/tipo-persona-enum';

export interface TipoPersona {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoPersonaList: TipoPersona[] = [
  {
    id: 1,
    descripcion: TipoPersonaEnum.FISICA,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: TipoPersonaEnum.JURIDICA,
    estado: EstadoEnum.ACTIVO,
  },
];
