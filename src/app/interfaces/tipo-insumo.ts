import { EstadoEnum } from 'src/app/enums/estado-enum';
import { TipoInsumoEnum } from 'src/app/enums/tipo-insumo-enum';

export interface TipoInsumo {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoInsumoList: TipoInsumo[] = [
  {
    id: 1,
    descripcion: TipoInsumoEnum.COMBUSTIBLE,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: TipoInsumoEnum.LUBRICANTES,
    estado: EstadoEnum.ACTIVO,
  },
];
