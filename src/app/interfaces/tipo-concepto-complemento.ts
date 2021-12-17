import { EstadoEnum } from 'src/app/enums/estado-enum';
import { TipoConceptoComplementoEnum } from 'src/app/enums/tipo-concepto-complemento-enum';

export interface TipoConceptoComplemento {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoConceptoComplementoList: TipoConceptoComplemento[] = [
  {
    id: 1,
    descripcion: TipoConceptoComplementoEnum.PEAJE,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: TipoConceptoComplementoEnum.EXPURGO,
    estado: EstadoEnum.ACTIVO,
  },
];
