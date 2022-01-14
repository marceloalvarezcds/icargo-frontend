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
    descripcion: TipoAnticipoEnum.TIPO_INSUMO,
    estado: EstadoEnum.ACTIVO,
  },
];
