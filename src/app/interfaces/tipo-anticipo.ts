import { EstadoEnum } from 'src/app/enums/estado-enum';
import { TipoAnticipoEnum } from 'src/app/enums/tipo-anticipo-enum';

export interface TipoAnticipo {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoAnticipoList: TipoAnticipo[] = [
  {
    id: 1,
    descripcion: TipoAnticipoEnum.EFECTIVO,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: TipoAnticipoEnum.COMBUSTIBLE,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 3,
    descripcion: TipoAnticipoEnum.LUBRICANTES,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 4,
    descripcion: TipoAnticipoEnum.OTROS,
    estado: EstadoEnum.ACTIVO,
  },
];
